import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { notifyRole, logAction } from '../utils/notifications';

const router = Router();
router.get('/', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const where = req.user!.role === 'NGO' ? { ngoId: req.user!.id } : {};
  res.json(await prisma.foodRequest.findMany({ where, include: { ngo: { select: { orgName: true, city: true, phone: true } } }, orderBy: { createdAt: 'desc' } }));
}));
router.post('/', authenticate, requireRole('NGO'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = z.object({ category: z.string().min(1), quantity: z.string().min(1), urgency: z.enum(['LOW', 'MEDIUM', 'HIGH']), notes: z.string().optional() }).parse(req.body);
  const foodRequest = await prisma.foodRequest.create({ data: { ...data, ngoId: req.user!.id } });
  await notifyRole('DONOR', 'FOOD_REQUEST', 'New food request', `An NGO needs ${data.quantity} of ${data.category} food (${data.urgency.toLowerCase()} urgency).`);
  await logAction(req.user!.id, 'CREATED', 'FOOD_REQUEST', foodRequest.id, data.category);
  res.status(201).json(foodRequest);
}));
router.patch('/:id', authenticate, requireRole('DONOR'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status } = z.object({ status: z.enum(['ACCEPTED', 'FULFILLED']) }).parse(req.body);
  const item = await prisma.foodRequest.update({ where: { id: req.params.id }, data: { status, acceptedById: req.user!.id }, include: { ngo: true } });
  await logAction(req.user!.id, status, 'FOOD_REQUEST', item.id, item.category);
  res.json(item);
}));
export default router;
