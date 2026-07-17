"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const notifications_1 = require("../utils/notifications");
const router = (0, express_1.Router)();
const include = { listing: { include: { donor: { select: { id: true, orgName: true, phone: true, address: true } } } }, ngo: { select: { id: true, orgName: true, city: true, phone: true } } };
router.get('/', auth_1.authenticate, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const where = {};
    if (req.user.role === 'NGO')
        where.ngoId = req.user.id;
    if (req.user.role === 'DONOR')
        where.listing = { donorId: req.user.id };
    if (req.query.status)
        where.status = req.query.status;
    res.json(await prisma_1.default.request.findMany({ where, include, orderBy: { createdAt: 'desc' } }));
}));
router.post('/', auth_1.authenticate, (0, auth_1.requireRole)('NGO'), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { listingId, message } = zod_1.z.object({ listingId: zod_1.z.string(), message: zod_1.z.string().optional() }).parse(req.body);
    const listing = await prisma_1.default.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
        res.status(404).json({ error: 'Donation not found' });
        return;
    }
    if (listing.status !== 'AVAILABLE') {
        res.status(409).json({ error: 'This donation has already been reserved' });
        return;
    }
    if (await prisma_1.default.request.findFirst({ where: { listingId, ngoId: req.user.id } })) {
        res.status(409).json({ error: 'You already requested this donation' });
        return;
    }
    const request = await prisma_1.default.request.create({ data: { listingId, ngoId: req.user.id, message }, include });
    const ngo = await prisma_1.default.user.findUnique({ where: { id: req.user.id }, select: { orgName: true } });
    await (0, notifications_1.createNotification)(listing.donorId, 'REQUEST_RECEIVED', 'New NGO request', `${ngo?.orgName || 'An NGO'} requested ${listing.title}.`);
    await (0, notifications_1.logAction)(req.user.id, 'REQUESTED', 'DONATION', listingId, listing.title);
    res.status(201).json(request);
}));
router.patch('/:id', auth_1.authenticate, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { status } = zod_1.z.object({ status: zod_1.z.enum(['ACCEPTED', 'REJECTED', 'PICKED_UP', 'COMPLETED']) }).parse(req.body);
    const request = await prisma_1.default.request.findUnique({ where: { id: req.params.id }, include });
    if (!request) {
        res.status(404).json({ error: 'Request not found' });
        return;
    }
    const isRestaurant = req.user.role === 'DONOR' && request.listing.donorId === req.user.id;
    const isNgo = req.user.role === 'NGO' && request.ngoId === req.user.id;
    if (!isRestaurant && !isNgo && req.user.role !== 'ADMIN') {
        res.status(403).json({ error: 'Access denied' });
        return;
    }
    if (status === 'ACCEPTED') {
        if (!isRestaurant || request.listing.status !== 'AVAILABLE') {
            res.status(409).json({ error: 'Donation is no longer available' });
            return;
        }
        const updated = await prisma_1.default.$transaction(async (tx) => {
            const lock = await tx.listing.updateMany({ where: { id: request.listingId, status: 'AVAILABLE' }, data: { status: 'RESERVED' } });
            if (!lock.count)
                throw new Error('Donation already accepted');
            await tx.request.updateMany({ where: { listingId: request.listingId, id: { not: request.id }, status: 'PENDING' }, data: { status: 'REJECTED' } });
            return tx.request.update({ where: { id: request.id }, data: { status: 'ACCEPTED' } });
        });
        await (0, notifications_1.createNotification)(request.ngoId, 'REQUEST_ACCEPTED', 'Donation reserved', `${request.listing.title} is reserved for your NGO.`);
        await (0, notifications_1.logAction)(req.user.id, 'ACCEPTED', 'DONATION_REQUEST', request.id, request.listing.title);
        res.json(updated);
        return;
    }
    if (status === 'PICKED_UP' && (!isNgo || request.listing.deliveryOption !== 'NGO_PICKUP')) {
        res.status(403).json({ error: 'Only the assigned NGO can confirm pickup' });
        return;
    }
    if (status === 'COMPLETED' && !isNgo) {
        res.status(403).json({ error: 'Only the assigned NGO can confirm receipt' });
        return;
    }
    const updated = await prisma_1.default.request.update({ where: { id: request.id }, data: { status } });
    if (status === 'PICKED_UP' || status === 'COMPLETED')
        await prisma_1.default.listing.update({ where: { id: request.listingId }, data: { status: 'COMPLETED' } });
    await (0, notifications_1.logAction)(req.user.id, status, 'DONATION_REQUEST', request.id, request.listing.title);
    res.json(updated);
}));
exports.default = router;
