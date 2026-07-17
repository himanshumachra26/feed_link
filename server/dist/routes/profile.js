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
const router = (0, express_1.Router)();
const profileSchema = zod_1.z.object({
    orgName: zod_1.z.string().min(2).optional(),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    avatar: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
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
router.get('/', auth_1.authenticate, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: req.user.id },
        select: SELECT,
    });
    res.json(user);
}));
// PUT /api/profile — update own profile
router.put('/', auth_1.authenticate, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const data = profileSchema.parse(req.body);
    const user = await prisma_1.default.user.update({
        where: { id: req.user.id },
        data,
        select: SELECT,
    });
    res.json(user);
}));
// GET /api/profile/:userId — public profile
router.get('/:userId', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = await prisma_1.default.user.findUnique({
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
}));
exports.default = router;
