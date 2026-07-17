import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { signToken } from '../utils/jwt';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

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

const registerSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['DONOR', 'NGO'], { message: 'Role must be DONOR or NGO' }),
  orgName: z.string().min(2, 'Organization name required'),
  phone: z.string().optional(),
  city: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password required'),
});

// POST /api/auth/register
router.post(
  '/register',
  asyncHandler(async (req, res: Response) => {
    const data = registerSchema.parse(req.body);

    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
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

    const token = signToken({ id: user.id, role: user.role, email: user.email });
    res.status(201).json({ token, user });
  })
);

// POST /api/auth/login
router.post(
  '/login',
  asyncHandler(async (req, res: Response) => {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const validPassword = await bcrypt.compare(data.password, user.password);
    if (!validPassword) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    if (!user.active) {
      res.status(403).json({ error: 'Account has been suspended. Contact admin.' });
      return;
    }

    const token = signToken({ id: user.id, role: user.role, email: user.email });
    const { password: _pw, ...safeUser } = user;
    res.json({ token, user: safeUser });
  })
);

// GET /api/auth/me
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: USER_SELECT,
    });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  })
);

// PUT /api/auth/password
router.put(
  '/password',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const passwordSchema = z.object({
      currentPassword: z.string(),
      newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    });

    const data = passwordSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const validPassword = await bcrypt.compare(data.currentPassword, user.password);
    if (!validPassword) {
      res.status(400).json({ error: 'Incorrect current password' });
      return;
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password updated successfully' });
  })
);

export default router;
