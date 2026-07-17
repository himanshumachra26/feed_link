import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { createNotification, notifyRole, logAction } from '../utils/notifications';

const router = Router();

const listingSchema = z.object({
  title: z.string().min(2, 'Title required'),
  description: z.string().optional(),
  foodType: z.string().min(1, 'Food type required'),
  category: z.string().optional(),
  condition: z.string().optional(),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().min(1, 'Unit required'),
  suitableFor: z.string().min(1, 'Suitable animals required'),
  servings: z.number().int().positive().optional(),
  deliveryOption: z.enum(['NGO_PICKUP', 'RESTAURANT_DELIVERY']).optional(),
  deliveryCharge: z.number().min(0).optional(),
  images: z.string().optional(),
  pickupStart: z.string(),
  pickupEnd: z.string(),
  address: z.string().min(2, 'Address required'),
  city: z.string().min(1, 'City required'),
  expiresAt: z.string(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// GET /api/listings — public, with filters
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { status, foodType, city, search, page = '1', limit = '12' } = req.query;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    } else if (!status) {
      where.status = 'AVAILABLE';
    }
    if (foodType) where.foodType = foodType as string;
    if (city) where.city = city as string;
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          donor: { select: { id: true, orgName: true, city: true, verified: true } },
          requests: {
            select: {
              id: true,
              status: true,
              ngo: { select: { id: true, orgName: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.listing.count({ where }),
    ]);

    res.json({ listings, total, page: pageNum, limit: limitNum });
  })
);

// GET /api/listings/mine — donor's own listings
router.get(
  '/mine',
  authenticate,
  requireRole('DONOR'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status } = req.query;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { donorId: req.user!.id };
    if (status) where.status = status;

    const listings = await prisma.listing.findMany({
      where,
      include: {
        requests: { select: { id: true, status: true, ngo: { select: { orgName: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(listings);
  })
);

// GET /api/listings/:id
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const listing = await prisma.listing.findUnique({
      where: { id: req.params.id },
      include: {
        donor: {
          select: { id: true, orgName: true, city: true, phone: true, verified: true, address: true },
        },
        requests: {
          include: { ngo: { select: { id: true, orgName: true, city: true } } },
        },
      },
    });
    if (!listing) {
      res.status(404).json({ error: 'Listing not found' });
      return;
    }
    res.json(listing);
  })
);

// POST /api/listings — donor only
router.post(
  '/',
  authenticate,
  requireRole('DONOR'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = listingSchema.parse(req.body);
    const listing = await prisma.listing.create({
      data: {
        donorId: req.user!.id,
        title: data.title,
        description: data.description,
        foodType: data.foodType,
        category: data.category || 'Veg', condition: data.condition || 'Cooked',
        quantity: data.quantity,
        unit: data.unit,
        suitableFor: data.suitableFor,
        servings: data.servings || 1, deliveryOption: data.deliveryOption || 'NGO_PICKUP', deliveryCharge: data.deliveryCharge || 0, images: data.images,
        pickupStart: new Date(data.pickupStart),
        pickupEnd: new Date(data.pickupEnd),
        address: data.address,
        city: data.city,
        expiresAt: new Date(data.expiresAt),
      },
    });
    await Promise.all([notifyRole('NGO', 'NEW_DONATION', 'New food donation available', `${listing.title} is available for collection.`), logAction(req.user!.id, 'CREATED', 'LISTING', listing.id, listing.title)]);
    res.status(201).json(listing);
  })
);

// PUT /api/listings/:id — donor owner only
router.put(
  '/:id',
  authenticate,
  requireRole('DONOR'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const listing = await prisma.listing.findUnique({ where: { id: req.params.id } });
    if (!listing) {
      res.status(404).json({ error: 'Listing not found' });
      return;
    }
    if (listing.donorId !== req.user!.id) {
      res.status(403).json({ error: 'You can only edit your own listings' });
      return;
    }

    const data = listingSchema.partial().parse(req.body);
    const updated = await prisma.listing.update({
      where: { id: req.params.id },
      data: {
        ...data,
        ...(data.quantity !== undefined && { quantity: data.quantity }),
        ...(data.pickupStart && { pickupStart: new Date(data.pickupStart) }),
        ...(data.pickupEnd && { pickupEnd: new Date(data.pickupEnd) }),
        ...(data.expiresAt && { expiresAt: new Date(data.expiresAt) }),
      },
    });
    res.json(updated);
  })
);

// DELETE /api/listings/:id
router.delete(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const listing = await prisma.listing.findUnique({ where: { id: req.params.id } });
    if (!listing) {
      res.status(404).json({ error: 'Listing not found' });
      return;
    }
    const isOwner = listing.donorId === req.user!.id;
    const isAdmin = req.user!.role === 'ADMIN';
    if (!isOwner && !isAdmin) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    await prisma.listing.delete({ where: { id: req.params.id } });
    res.json({ message: 'Listing deleted' });
  })
);

// PATCH /api/listings/:id/status — donor marks expired/collected
router.patch(
  '/:id/status',
  authenticate,
  requireRole('DONOR'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status } = z.object({ status: z.string() }).parse(req.body);
    const listing = await prisma.listing.findUnique({ where: { id: req.params.id } });
    if (!listing) {
      res.status(404).json({ error: 'Listing not found' });
      return;
    }
    if (listing.donorId !== req.user!.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const updated = await prisma.listing.update({
      where: { id: req.params.id },
      data: { status },
    });

    // Notify NGOs if donor cancels a listing they requested
    if (status === 'EXPIRED') {
      const pendingRequests = await prisma.request.findMany({
        where: { listingId: req.params.id, status: 'PENDING' },
      });
      for (const req of pendingRequests) {
        await createNotification(
          req.ngoId,
          'SYSTEM',
          'Listing No Longer Available',
          `The listing "${listing.title}" is no longer available.`
        );
      }
    }

    res.json(updated);
  })
);

export default router;
