import { z } from 'zod';
import { env } from '~/env';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { PubSub } from '@google-cloud/pubsub';
import { CloudTasksClient, type protos } from '@google-cloud/tasks';

export const blockchainRouter = createTRPCRouter({
    mint: publicProcedure.input(z.object({})).mutation(async () => {
        // const signer = await getSigner();
        // const contract = await getContract();
        await getSigner();
        await getContract();
        await lazyMint();
        await claim();
    }),

    publish: publicProcedure.input(z.object({})).mutation(async () => {
        await publish();
    }),

    enqueue: publicProcedure.input(z.object({})).mutation(async () => {
        await enqueue();
    }),
});

const getSigner = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
};

const getContract = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
};

const lazyMint = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
};

const claim = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
};

const enqueue = async () => {
    // `Cloud Tasks Enqueuer`ロールおよび
    // `Service Account User`ロールが必要
    const client = new CloudTasksClient({
        projectId: env.GCP_PROJECT_ID,
        credentials: {
            client_email: env.GCP_CLIENT_EMAIL,
            private_key: env.GCP_PRIVATE_KEY,
        },
    });
    const parent = client.queuePath(env.GCP_PROJECT_ID, env.GCP_CLOUD_TASKS_LOCATION, env.GCP_CLOUD_TASKS_QUEUE);
    const task: protos.google.cloud.tasks.v2.ITask = {
        httpRequest: {
            httpMethod: 'POST',
            url: `${env.VERCEL_URL}/api/subscriber`,
            oidcToken: {
                serviceAccountEmail: env.GCP_CLIENT_EMAIL,
            },
            body: Buffer.from(JSON.stringify({ message: 'hello' })).toString('base64'),
        },
    };
    const [response] = await client.createTask({ parent, task });
    const { name } = response;
    console.log(`Created task ${name}`);
};

const publish = async () => {
    // `Pub/Sub Publisher`ロールが必要
    const pubSubClient = new PubSub({
        projectId: env.GCP_PROJECT_ID,
        credentials: {
            client_email: env.GCP_CLIENT_EMAIL,
            private_key: env.GCP_PRIVATE_KEY,
        },
    });
    const topicName = 'test';
    const message = { data: 'Your message content' };

    const messageId = await pubSubClient.topic(topicName).publishMessage({ json: message });
    return messageId;
};
