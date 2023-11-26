import axios from 'axios';
import { z } from 'zod';
import { env } from '~/env';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const chigiriRouter = createTRPCRouter({
    get: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
        return ctx.db.chigiri.findUnique({
            where: { id: input.id },
        });
    }),

    create: publicProcedure
        .input(z.object({ idToken: z.string().min(1), content: z.string().min(1), senderName: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            const { idToken } = input;
            const userId = await getUserId(idToken);
            const chigiri = await ctx.db.chigiri.create({
                data: {
                    sender: { connectOrCreate: { where: { id: userId }, create: { id: userId } } },
                    content: input.content,
                    senderName: input.senderName,
                },
            });
            console.log('chigiri created', chigiri.id);
            return chigiri;
        }),

    update: publicProcedure
        .input(z.object({ id: z.string().min(1), idToken: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            const { idToken } = input;
            const userId = await getUserId(idToken);
            return ctx.db.chigiri.update({
                where: { id: input.id },
                data: { receiver: { connectOrCreate: { where: { id: userId }, create: { id: userId } } } },
            });
        }),

    delete: publicProcedure.input(z.object({ id: z.string().min(1) })).mutation(async ({ ctx, input }) => {
        return ctx.db.chigiri.delete({
            where: { id: input.id },
        });
    }),
});

const getUserId = async (idToken: string) => {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const payload = { id_token: idToken, client_id: env.NEXT_PUBLIC_LIFF_ID.split('-')[0] };
    const url = 'https://api.line.me/oauth2/v2.1/verify';
    try {
        const res = await axios.post<{ sub: string }>(url, payload, { headers });
        return res.data.sub;
    } catch (e) {
        console.error(e);
        throw e;
    }
};
