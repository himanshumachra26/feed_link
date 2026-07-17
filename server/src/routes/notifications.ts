import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/notifications
router.get(
  '/',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(notifications);
  })
);

// GET /api/notifications/unread-count
router.get(
  '/unread-count',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const count = await prisma.notification.count({
      where: { userId: req.user!.id, read: false },
    });
    res.json({ count });
  })
);

// PATCH /api/notifications/read-all
router.patch(
  '/read-all',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await prisma.notification.updateMany({
      where: { userId: req.user!.id, read: false },
      data: { read: true },
    });
    res.json({ message: 'All notifications marked as read' });
  })
);

// PATCH /api/notifications/:id/read
router.patch(
  '/:id/read',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await prisma.notification.update({
      where: { id: req.params.id },
      data: { read: true },
    });
    res.json({ message: 'Marked as read' });
  })
);

export default router;
