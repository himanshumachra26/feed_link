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
const listingSchema = zod_1.z.object({
    title: zod_1.z.string().min(2, 'Title required'),
    description: zod_1.z.string().optional(),
    foodType: zod_1.z.string().min(1, 'Food type required'),
    category: zod_1.z.string().optional(),
    condition: zod_1.z.string().optional(),
    quantity: zod_1.z.number().positive('Quantity must be positive'),
    unit: zod_1.z.string().min(1, 'Unit required'),
    suitableFor: zod_1.z.string().min(1, 'Suitable animals required'),
    servings: zod_1.z.number().int().positive().optional(),
    deliveryOption: zod_1.z.enum(['NGO_PICKUP', 'RESTAURANT_DELIVERY']).optional(),
    deliveryCharge: zod_1.z.number().min(0).optional(),
    images: zod_1.z.string().optional(),
    pickupStart: zod_1.z.string(),
    pickupEnd: zod_1.z.string(),
    address: zod_1.z.string().min(2, 'Address required'),
    city: zod_1.z.string().min(1, 'City required'),
    expiresAt: zod_1.z.string(),
    lat: zod_1.z.number().optional(),
    lng: zod_1.z.number().optional(),
});
// GET /api/listings — public, with filters
router.get('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { status, foodType, city, search, page = '1', limit = '12' } = req.query;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where = {};
    // Default to AVAILABLE unless explicitly specified
    where.status = status || 'AVAILABLE';
    if (foodType)
        where.foodType = foodType;
    if (city)
        where.city = city;
    if (search) {
        where.OR = [
            { title: { contains: search } },
            { description: { contains: search } },
        ];
    }
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    const [listings, total] = await Promise.all([
        prisma_1.default.listing.findMany({
            where,
            include: {
                donor: { select: { id: true, orgName: true, city: true, verified: true } },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limitNum,
        }),
        prisma_1.default.listing.count({ where }),
    ]);
    res.json({ listings, total, page: pageNum, limit: limitNum });
}));
// GET /api/listings/mine — donor's own listings
router.get('/mine', auth_1.authenticate, (0, auth_1.requireRole)('DONOR'), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { status } = req.query;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where = { donorId: req.user.id };
    if (status)
        where.status = status;
    const listings = await prisma_1.default.listing.findMany({
        where,
        include: {
            requests: { select: { id: true, status: true, ngo: { select: { orgName: true } } } },
        },
        orderBy: { createdAt: 'desc' },
    });
    res.json(listings);
}));
// GET /api/listings/:id
router.get('/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const listing = await prisma_1.default.listing.findUnique({
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
}));
// POST /api/listings — donor only
router.post('/', auth_1.authenticate, (0, auth_1.requireRole)('DONOR'), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const data = listingSchema.parse(req.body);
    const listing = await prisma_1.default.listing.create({
        data: {
            donorId: req.user.id,
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
    await Promise.all([(0, notifications_1.notifyRole)('NGO', 'NEW_DONATION', 'New food donation available', `${listing.title} is available for collection.`), (0, notifications_1.logAction)(req.user.id, 'CREATED', 'LISTING', listing.id, listing.title)]);
    res.status(201).json(listing);
}));
// PUT /api/listings/:id — donor owner only
router.put('/:id', auth_1.authenticate, (0, auth_1.requireRole)('DONOR'), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const listing = await prisma_1.default.listing.findUnique({ where: { id: req.params.id } });
    if (!listing) {
        res.status(404).json({ error: 'Listing not found' });
        return;
    }
    if (listing.donorId !== req.user.id) {
        res.status(403).json({ error: 'You can only edit your own listings' });
        return;
    }
    const data = listingSchema.partial().parse(req.body);
    const updated = await prisma_1.default.listing.update({
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
}));
// DELETE /api/listings/:id
router.delete('/:id', auth_1.authenticate, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const listing = await prisma_1.default.listing.findUnique({ where: { id: req.params.id } });
    if (!listing) {
        res.status(404).json({ error: 'Listing not found' });
        return;
    }
    const isOwner = listing.donorId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';
    if (!isOwner && !isAdmin) {
        res.status(403).json({ error: 'Access denied' });
        return;
    }
    await prisma_1.default.listing.delete({ where: { id: req.params.id } });
    res.json({ message: 'Listing deleted' });
}));
// PATCH /api/listings/:id/status — donor marks expired/collected
router.patch('/:id/status', auth_1.authenticate, (0, auth_1.requireRole)('DONOR'), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { status } = zod_1.z.object({ status: zod_1.z.string() }).parse(req.body);
    const listing = await prisma_1.default.listing.findUnique({ where: { id: req.params.id } });
    if (!listing) {
        res.status(404).json({ error: 'Listing not found' });
        return;
    }
    if (listing.donorId !== req.user.id) {
        res.status(403).json({ error: 'Access denied' });
        return;
    }
    const updated = await prisma_1.default.listing.update({
        where: { id: req.params.id },
        data: { status },
    });
    // Notify NGOs if donor cancels a listing they requested
    if (status === 'EXPIRED') {
        const pendingRequests = await prisma_1.default.request.findMany({
            where: { listingId: req.params.id, status: 'PENDING' },
        });
        for (const req of pendingRequests) {
            await (0, notifications_1.createNotification)(req.ngoId, 'SYSTEM', 'Listing No Longer Available', `The listing "${listing.title}" is no longer available.`);
        }
    }
    res.json(updated);
}));
exports.default = router;
