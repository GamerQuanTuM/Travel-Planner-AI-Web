import 'server-only';
import { cache } from 'react';
import { verifySession } from './session';
import { prismadb } from '@/utils/prismadb';

export const getSession = cache(async () => {
    const session = await verifySession();
    if (!session) return null;

    try {

        const user = await prismadb.user.findFirst({
            where: {
                id: session?.userId
            },
            select: {
                email: true,
                id: true,
                name: true,
                updatedAt: true,
                createdAt: true,
            }
        })

        return user


    } catch (error) {
        console.log('Failed to fetch user');
        return null;
    }
});
