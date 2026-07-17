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
router.get('/', auth_1.authenticate, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const where = req.user.role === 'NGO' ? { ngoId: req.user.id } : {};
    res.json(await prisma_1.default.foodRequest.findMany({ where, include: { ngo: { select: { orgName: true, city: true, phone: true } } }, orderBy: { createdAt: 'desc' } }));
}));
router.post('/', auth_1.authenticate, (0, auth_1.requireRole)('NGO'), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const data = zod_1.z.object({ category: zod_1.z.string().min(1), quantity: zod_1.z.string().min(1), urgency: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH']), notes: zod_1.z.string().optional() }).parse(req.body);
    const foodRequest = await prisma_1.default.foodRequest.create({ data: { ...data, ngoId: req.user.id } });
    await (0, notifications_1.notifyRole)('DONOR', 'FOOD_REQUEST', 'New food request', `An NGO needs ${data.quantity} of ${data.category} food (${data.urgency.toLowerCase()} urgency).`);
    await (0, notifications_1.logAction)(req.user.id, 'CREATED', 'FOOD_REQUEST', foodRequest.id, data.category);
    res.status(201).json(foodRequest);
}));
router.patch('/:id', auth_1.authenticate, (0, auth_1.requireRole)('DONOR'), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { status } = zod_1.z.object({ status: zod_1.z.enum(['ACCEPTED', 'FULFILLED']) }).parse(req.body);
    const item = await prisma_1.default.foodRequest.update({ where: { id: req.params.id }, data: { status, acceptedById: req.user.id }, include: { ngo: true } });
    await (0, notifications_1.logAction)(req.user.id, status, 'FOOD_REQUEST', item.id, item.category);
    res.json(item);
}));
exports.default = router;
