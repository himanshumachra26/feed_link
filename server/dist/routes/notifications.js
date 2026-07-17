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
// GET /api/notifications
router.get('/', auth_1.authenticate, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const notifications = await prisma_1.default.notification.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        take: 50,
    });
    res.json(notifications);
}));
// GET /api/notifications/unread-count
router.get('/unread-count', auth_1.authenticate, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const count = await prisma_1.default.notification.count({
        where: { userId: req.user.id, read: false },
    });
    res.json({ count });
}));
// PATCH /api/notifications/read-all
router.patch('/read-all', auth_1.authenticate, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await prisma_1.default.notification.updateMany({
        where: { userId: req.user.id, read: false },
        data: { read: true },
    });
    res.json({ message: 'All notifications marked as read' });
}));
// PATCH /api/notifications/:id/read
router.patch('/:id/read', auth_1.authenticate, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await prisma_1.default.notification.update({
        where: { id: req.params.id },
        data: { read: true },
    });
    res.json({ message: 'Marked as read' });
}));
exports.default = router;
