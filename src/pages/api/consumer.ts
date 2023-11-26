import type { NextApiRequest, NextApiResponse } from 'next';
import { OAuth2Client } from 'google-auth-library';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('consumer called');

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

    // process
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log(req.body);

    return res.status(200).json({ success: true });
}
