import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

const profileSchema = z.object({
  orgName: z.string().min(2).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal('')),
});

const SELECT = {
  id: true,
  email: true,
  role: true,
  orgName: true,
  verified: true,
  phone: true,
  address: true,
  city: true,
  avatar: true,
  createdAt: true,
};

// GET /api/profile — own profile
router.get(
  '/',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: SELECT,
    });
    res.json(user);
  })
);

// PUT /api/profile — update own profile
router.put(
  '/',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = profileSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data,
      select: SELECT,
    });
    res.json(user);
  })
);

// GET /api/profile/:userId — public profile
router.get(
  '/:userId',
  asyncHandler(async (req, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
      select: {
        ...SELECT,
        _count: { select: { listings: true, requests: true } },
      },
    });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  })
);

export default router;
