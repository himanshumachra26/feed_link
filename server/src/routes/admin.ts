import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// All admin routes require ADMIN role
router.use(authenticate, requireRole('ADMIN'));

// GET /api/admin/users
router.get(
  '/users',
  asyncHandler(async (req, res: Response) => {
    const { role, page = '1', search } = req.query;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { email: { contains: search as string } },
        { orgName: { contains: search as string } },
      ];
    }

    const pageNum = parseInt(page as string, 10);
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          role: true,
          orgName: true,
          verified: true,
          active: true,
          city: true,
          createdAt: true,
          _count: { select: { listings: true, requests: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * 20,
        take: 20,
      }),
      prisma.user.count({ where }),
    ]);
    res.json({ users, total, page: pageNum });
  })
);

// PATCH /api/admin/users/:id/verify — toggle verified
router.patch(
  '/users/:id/verify',
  asyncHandler(async (req, res: Response) => {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { verified: !user.verified },
      select: { id: true, verified: true, orgName: true },
    });
    res.json(updated);
  })
);

// PATCH /api/admin/users/:id/suspend — toggle active
router.patch(
  '/users/:id/suspend',
  asyncHandler(async (req, res: Response) => {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { active: !user.active },
      select: { id: true, active: true, orgName: true },
    });
    res.json(updated);
  })
);

// DELETE /api/admin/users/:id
router.delete(
  '/users/:id',
  asyncHandler(async (req, res: Response) => {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'User deleted' });
  })
);

// GET /api/admin/listings — moderation view
router.get(
  '/listings',
  asyncHandler(async (req, res: Response) => {
    const listings = await prisma.listing.findMany({
      include: { donor: { select: { orgName: true, city: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(listings);
  })
);

// GET /api/admin/stats — platform analytics
router.get(
  '/stats',
  asyncHandler(async (req, res: Response) => {
    const [
      totalUsers,
      totalDonors,
      totalNGOs,
      totalListings,
      totalRequests,
      availableListings,
      collectedListings,
      pendingRequests,
      completedRequests,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'DONOR' } }),
      prisma.user.count({ where: { role: 'NGO' } }),
      prisma.listing.count(),
      prisma.request.count(),
      prisma.listing.count({ where: { status: 'AVAILABLE' } }),
      prisma.listing.count({ where: { status: 'COLLECTED' } }),
      prisma.request.count({ where: { status: 'PENDING' } }),
      prisma.request.count({ where: { status: 'COLLECTED' } }),
    ]);

    res.json({
      totalUsers,
      totalDonors,
      totalNGOs,
      totalListings,
      totalRequests,
      availableListings,
      collectedListings,
      pendingRequests,
      completedRequests,
    });
  })
);

export default router;
