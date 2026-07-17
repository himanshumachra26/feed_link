"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../utils/prisma"));
const jwt_1 = require("../utils/jwt");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
const USER_SELECT = {
    id: true,
    email: true,
    role: true,
    orgName: true,
    verified: true,
    active: true,
    phone: true,
    address: true,
    city: true,
    avatar: true,
    createdAt: true,
};
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Valid email required'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    role: zod_1.z.enum(['DONOR', 'NGO'], { message: 'Role must be DONOR or NGO' }),
    orgName: zod_1.z.string().min(2, 'Organization name required'),
    phone: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1, 'Password required'),
});
// POST /api/auth/register
router.post('/register', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const data = registerSchema.parse(req.body);
    const exists = await prisma_1.default.user.findUnique({ where: { email: data.email } });
    if (exists) {
        res.status(400).json({ error: 'Email already registered' });
        return;
    }
    const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
    const user = await prisma_1.default.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
            role: data.role,
            orgName: data.orgName,
            phone: data.phone,
            city: data.city,
        },
        select: USER_SELECT,
    });
    const token = (0, jwt_1.signToken)({ id: user.id, role: user.role, email: user.email });
    res.status(201).json({ token, user });
}));
// POST /api/auth/login
router.post('/login', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const data = loginSchema.parse(req.body);
    const user = await prisma_1.default.user.findUnique({ where: { email: data.email } });
    if (!user) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
    }
    const validPassword = await bcryptjs_1.default.compare(data.password, user.password);
    if (!validPassword) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
    }
    if (!user.active) {
        res.status(403).json({ error: 'Account has been suspended. Contact admin.' });
        return;
    }
    const token = (0, jwt_1.signToken)({ id: user.id, role: user.role, email: user.email });
    const { password: _pw, ...safeUser } = user;
    res.json({ token, user: safeUser });
}));
// GET /api/auth/me
router.get('/me', auth_1.authenticate, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: req.user.id },
        select: USER_SELECT,
    });
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    res.json(user);
}));
exports.default = router;
