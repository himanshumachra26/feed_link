"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAction = exports.notifyRole = exports.createNotification = void 0;
const prisma_1 = __importDefault(require("./prisma"));
const createNotification = async (userId, type, title, body) => {
    return prisma_1.default.notification.create({
        data: { userId, type, title, body },
    });
};
exports.createNotification = createNotification;
const notifyRole = async (role, type, title, body) => {
    const users = await prisma_1.default.user.findMany({ where: { role, active: true }, select: { id: true } });
    if (users.length)
        await prisma_1.default.notification.createMany({ data: users.map((user) => ({ userId: user.id, type, title, body })) });
};
exports.notifyRole = notifyRole;
const logAction = async (userId, action, entity, entityId, details) => prisma_1.default.actionLog.create({ data: { userId, action, entity, entityId, details } });
exports.logAction = logAction;
