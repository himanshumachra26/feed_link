import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/stats/dashboard — role-specific quick stats
router.get(
  '/dashboard',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const role = req.user!.role;

    if (role === 'DONOR') {
      const [totalListings, activeListings, totalRequests, pendingRequests, completedDonations] =
        await Promise.all([
          prisma.listing.count({ where: { donorId: userId } }),
          prisma.listing.count({ where: { donorId: userId, status: 'AVAILABLE' } }),
          prisma.request.count({ where: { listing: { donorId: userId } } }),
          prisma.request.count({ where: { listing: { donorId: userId }, status: 'PENDING' } }),
          prisma.listing.count({ where: { donorId: userId, status: 'COLLECTED' } }),
        ]);
      res.json({ totalListings, activeListings, totalRequests, pendingRequests, completedDonations });
      return;
    }

    if (role === 'NGO') {
      const [totalRequests, pendingRequests, acceptedRequests, completedPickups, availableListings] =
        await Promise.all([
          prisma.request.count({ where: { ngoId: userId } }),
          prisma.request.count({ where: { ngoId: userId, status: 'PENDING' } }),
          prisma.request.count({ where: { ngoId: userId, status: 'ACCEPTED' } }),
          prisma.request.count({ where: { ngoId: userId, status: 'COLLECTED' } }),
          prisma.listing.count({ where: { status: 'AVAILABLE' } }),
        ]);
      res.json({ totalRequests, pendingRequests, acceptedRequests, completedPickups, availableListings });
      return;
    }

    // Admin
    const [totalUsers, totalListings, totalRequests, completedRequests] = await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.request.count(),
      prisma.request.count({ where: { status: 'COLLECTED' } }),
    ]);
    res.json({ totalUsers, totalListings, totalRequests, completedRequests });
  })
);

export default router;
