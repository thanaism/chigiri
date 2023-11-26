import { chigiriRouter } from '~/server/api/routers/chigiri';
import { createTRPCRouter } from '~/server/api/trpc';
import { blockchainRouter } from './routers/blockchain';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    chigiri: chigiriRouter,
    blockchain: blockchainRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
