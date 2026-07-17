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
// GET /api/stats/dashboard — role-specific quick stats
router.get('/dashboard', auth_1.authenticate, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;
    if (role === 'DONOR') {
        const [totalListings, activeListings, totalRequests, pendingRequests, completedDonations] = await Promise.all([
            prisma_1.default.listing.count({ where: { donorId: userId } }),
            prisma_1.default.listing.count({ where: { donorId: userId, status: 'AVAILABLE' } }),
            prisma_1.default.request.count({ where: { listing: { donorId: userId } } }),
            prisma_1.default.request.count({ where: { listing: { donorId: userId }, status: 'PENDING' } }),
            prisma_1.default.listing.count({ where: { donorId: userId, status: 'COLLECTED' } }),
        ]);
        res.json({ totalListings, activeListings, totalRequests, pendingRequests, completedDonations });
        return;
    }
    if (role === 'NGO') {
        const [totalRequests, pendingRequests, acceptedRequests, completedPickups, availableListings] = await Promise.all([
            prisma_1.default.request.count({ where: { ngoId: userId } }),
            prisma_1.default.request.count({ where: { ngoId: userId, status: 'PENDING' } }),
            prisma_1.default.request.count({ where: { ngoId: userId, status: 'ACCEPTED' } }),
            prisma_1.default.request.count({ where: { ngoId: userId, status: 'COLLECTED' } }),
            prisma_1.default.listing.count({ where: { status: 'AVAILABLE' } }),
        ]);
        res.json({ totalRequests, pendingRequests, acceptedRequests, completedPickups, availableListings });
        return;
    }
    // Admin
    const [totalUsers, totalListings, totalRequests, completedRequests] = await Promise.all([
        prisma_1.default.user.count(),
        prisma_1.default.listing.count(),
        prisma_1.default.request.count(),
        prisma_1.default.request.count({ where: { status: 'COLLECTED' } }),
    ]);
    res.json({ totalUsers, totalListings, totalRequests, completedRequests });
}));
exports.default = router;
