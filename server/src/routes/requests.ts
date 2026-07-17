import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { createNotification, logAction } from '../utils/notifications';

const router = Router();
const include = { listing: { include: { donor: { select: { id: true, orgName: true, phone: true, address: true } } } }, ngo: { select: { id: true, orgName: true, city: true, phone: true } } };

router.get('/', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const where: Record<string, unknown> = {};
  if (req.user!.role === 'NGO') where.ngoId = req.user!.id;
  if (req.user!.role === 'DONOR') where.listing = { donorId: req.user!.id };
  if (req.query.status) where.status = req.query.status as string;
  res.json(await prisma.request.findMany({ where, include, orderBy: { createdAt: 'desc' } }));
}));

router.post('/', authenticate, requireRole('NGO'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { listingId, message } = z.object({ listingId: z.string(), message: z.string().optional() }).parse(req.body);
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) { res.status(404).json({ error: 'Donation not found' }); return; }
  if (listing.status !== 'AVAILABLE') { res.status(409).json({ error: 'This donation has already been reserved' }); return; }
  if (await prisma.request.findFirst({ where: { listingId, ngoId: req.user!.id } })) { res.status(409).json({ error: 'You already requested this donation' }); return; }
  const request = await prisma.request.create({ data: { listingId, ngoId: req.user!.id, message }, include });
  const ngo = await prisma.user.findUnique({ where: { id: req.user!.id }, select: { orgName: true } });
  await createNotification(listing.donorId, 'REQUEST_RECEIVED', 'New NGO request', `${ngo?.orgName || 'An NGO'} requested ${listing.title}.`);
  await logAction(req.user!.id, 'REQUESTED', 'DONATION', listingId, listing.title);
  res.status(201).json(request);
}));

router.patch('/:id', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status } = z.object({ status: z.enum(['ACCEPTED', 'REJECTED', 'PICKED_UP', 'COMPLETED']) }).parse(req.body);
  const request = await prisma.request.findUnique({ where: { id: req.params.id }, include });
  if (!request) { res.status(404).json({ error: 'Request not found' }); return; }
  const isRestaurant = req.user!.role === 'DONOR' && request.listing.donorId === req.user!.id;
  const isNgo = req.user!.role === 'NGO' && request.ngoId === req.user!.id;
  if (!isRestaurant && !isNgo && req.user!.role !== 'ADMIN') { res.status(403).json({ error: 'Access denied' }); return; }
  if (status === 'ACCEPTED') {
    if (!isRestaurant || request.listing.status !== 'AVAILABLE') { res.status(409).json({ error: 'Donation is no longer available' }); return; }
    const updated = await prisma.$transaction(async (tx) => {
      const lock = await tx.listing.updateMany({ where: { id: request.listingId, status: 'AVAILABLE' }, data: { status: 'RESERVED' } });
      if (!lock.count) throw new Error('Donation already accepted');
      await tx.request.updateMany({ where: { listingId: request.listingId, id: { not: request.id }, status: 'PENDING' }, data: { status: 'REJECTED' } });
      return tx.request.update({ where: { id: request.id }, data: { status: 'ACCEPTED' } });
    });
    await createNotification(request.ngoId, 'REQUEST_ACCEPTED', 'Donation reserved', `${request.listing.title} is reserved for your NGO.`);
    await logAction(req.user!.id, 'ACCEPTED', 'DONATION_REQUEST', request.id, request.listing.title);
    res.json(updated); return;
  }
  if (status === 'PICKED_UP' && !isNgo && !isRestaurant) { res.status(403).json({ error: 'Only the assigned NGO or Donor can mark food as picked up / left' }); return; }
  if (status === 'COMPLETED' && !isNgo) { res.status(403).json({ error: 'Only the assigned NGO can confirm receipt / food reached' }); return; }
  const updated = await prisma.request.update({ where: { id: request.id }, data: { status } });
  if (status === 'PICKED_UP' || status === 'COMPLETED') await prisma.listing.update({ where: { id: request.listingId }, data: { status: 'COMPLETED' } });
  await logAction(req.user!.id, status, 'DONATION_REQUEST', request.id, request.listing.title);
  res.json(updated);
}));

export default router;
