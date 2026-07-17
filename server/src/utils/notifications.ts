import prisma from './prisma';

export const createNotification = async (
  userId: string,
  type: string,
  title: string,
  body: string
) => {
  return prisma.notification.create({
    data: { userId, type, title, body },
  });
};

export const notifyRole = async (role: string, type: string, title: string, body: string) => {
  const users = await prisma.user.findMany({ where: { role, active: true }, select: { id: true } });
  if (users.length) await prisma.notification.createMany({ data: users.map((user) => ({ userId: user.id, type, title, body })) });
};

export const logAction = async (userId: string | undefined, action: string, entity: string, entityId?: string, details?: string) =>
  prisma.actionLog.create({ data: { userId, action, entity, entityId, details } });
