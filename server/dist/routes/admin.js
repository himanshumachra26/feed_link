"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// All admin routes require ADMIN role
router.use(auth_1.authenticate, (0, auth_1.requireRole)('ADMIN'));
// GET /api/admin/users
router.get('/users', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { role, page = '1', search } = req.query;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where = {};
    if (role)
        where.role = role;
    if (search) {
        where.OR = [
            { email: { contains: search } },
            { orgName: { contains: search } },
        ];
    }
    const pageNum = parseInt(page, 10);
    const [users, total] = await Promise.all([
        prisma_1.default.user.findMany({
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
        prisma_1.default.user.count({ where }),
    ]);
    res.json({ users, total, page: pageNum });
}));
// PATCH /api/admin/users/:id/verify — toggle verified
router.patch('/users/:id/verify', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = await prisma_1.default.user.findUnique({ where: { id: req.params.id } });
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    const updated = await prisma_1.default.user.update({
        where: { id: req.params.id },
        data: { verified: !user.verified },
        select: { id: true, verified: true, orgName: true },
    });
    res.json(updated);
}));
// PATCH /api/admin/users/:id/suspend — toggle active
router.patch('/users/:id/suspend', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = await prisma_1.default.user.findUnique({ where: { id: req.params.id } });
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    const updated = await prisma_1.default.user.update({
        where: { id: req.params.id },
        data: { active: !user.active },
        select: { id: true, active: true, orgName: true },
    });
    res.json(updated);
}));
// DELETE /api/admin/users/:id
router.delete('/users/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await prisma_1.default.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'User deleted' });
}));
// GET /api/admin/listings — moderation view
router.get('/listings', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const listings = await prisma_1.default.listing.findMany({
        include: { donor: { select: { orgName: true, city: true } } },
        orderBy: { createdAt: 'desc' },
        take: 50,
    });
    res.json(listings);
}));
// GET /api/admin/stats — platform analytics
router.get('/stats', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const [totalUsers, totalDonors, totalNGOs, totalListings, totalRequests, availableListings, collectedListings, pendingRequests, completedRequests,] = await Promise.all([
        prisma_1.default.user.count(),
        prisma_1.default.user.count({ where: { role: 'DONOR' } }),
        prisma_1.default.user.count({ where: { role: 'NGO' } }),
        prisma_1.default.listing.count(),
        prisma_1.default.request.count(),
        prisma_1.default.listing.count({ where: { status: 'AVAILABLE' } }),
        prisma_1.default.listing.count({ where: { status: 'COLLECTED' } }),
        prisma_1.default.request.count({ where: { status: 'PENDING' } }),
        prisma_1.default.request.count({ where: { status: 'COLLECTED' } }),
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
}));
exports.default = router;
