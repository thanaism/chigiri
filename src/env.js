import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
    /**
     * Specify your server-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars.
     */
    server: {
        NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
        VERCEL_URL: z.string().url(),
        // LINE
        LINE_MESSAGING_API_CLIENT_ID: z.string().regex(/^\d{10}$/),
        LINE_MESSAGING_API_CLIENT_SECRET: z.string().regex(/^[a-zA-Z0-9]{32}$/),
        // Prisma
        POSTGRES_PRISMA_URL: z.string().url(),
        POSTGRES_URL_NON_POOLING: z.string().url(),
        // Google Cloud Platform
        GCP_PROJECT_ID: z.string().min(1),
        GCP_CLIENT_EMAIL: z.string().email(),
        GCP_PRIVATE_KEY: z.string().min(1),
        GCP_CLOUD_TASKS_LOCATION: z.string().min(1),
        GCP_CLOUD_TASKS_QUEUE: z.string().min(1),
    },

    /**
     * Specify your client-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars. To expose them to the client, prefix them with
     * `NEXT_PUBLIC_`.
     */
    client: {
        // NEXT_PUBLIC_CLIENTVAR: z.string(),
        NEXT_PUBLIC_LIFF_ID: z.string().regex(/^\d{10}-[a-zA-Z0-9]{8}$/),
    },

    /**
     * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
     * middlewares) or client-side so we need to destruct manually.
     */
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_URL: process.env.VERCEL_URL,
        // LINE
        LINE_MESSAGING_API_CLIENT_ID: process.env.LINE_MESSAGING_API_CLIENT_ID,
        LINE_MESSAGING_API_CLIENT_SECRET: process.env.LINE_MESSAGING_API_CLIENT_SECRET,
        // Prisma
        POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
        POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
        // Google Cloud Platform
        GCP_PROJECT_ID: process.env.GCP_PROJECT_ID,
        GCP_CLIENT_EMAIL: process.env.GCP_CLIENT_EMAIL,
        GCP_PRIVATE_KEY: process.env.GCP_PRIVATE_KEY,
        GCP_CLOUD_TASKS_LOCATION: process.env.GCP_CLOUD_TASKS_LOCATION,
        GCP_CLOUD_TASKS_QUEUE: process.env.GCP_CLOUD_TASKS_QUEUE,
        // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
        NEXT_PUBLIC_LIFF_ID: process.env.NEXT_PUBLIC_LIFF_ID,
    },
    /**
     * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
     * useful for Docker builds.
     */
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    /**
     * Makes it so that empty strings are treated as undefined.
     * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
     */
    emptyStringAsUndefined: true,
});
