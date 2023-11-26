import type { NextApiRequest, NextApiResponse } from 'next';
import { OAuth2Client } from 'google-auth-library';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('subscriber called');

    // verify token
    try {
        const { authorization: bearer } = req.headers;
        if (!bearer) throw new Error('no bearer');
        const [, token] = bearer.match(/Bearer (.*)/)!;
        const authClient = new OAuth2Client();
        await authClient.verifyIdToken({ idToken: token! });
    } catch {
        console.error('verification failed');
        return res.status(401).json({ success: false });
    }

    // parse message
    const body = req.body as PubSubPayload;
    const message = Buffer.from(body.message.data, 'base64').toString('utf-8');
    const json = JSON.parse(message) as Message;
    console.table({ message });
    console.table(json);

    return res.status(200).json({ success: true });
}

// ユーザー定義のメッセージ型
type Message = {
    data: string;
};

type PubSubPayload = {
    message: {
        data: string;
        messageId: string;
        message_id: string;
        publishTime: string;
        publish_time: string;
    };
    subscription: string;
};
