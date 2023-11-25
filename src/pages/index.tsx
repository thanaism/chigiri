import Head from 'next/head';
import { api } from '~/utils/api';
import styles from './index.module.css';
import type { Liff } from '@line/liff';
import { useEffect, useState } from 'react';
import { Button, Image, Text } from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';
import { env } from '~/env';

export default function Home({ liff }: { liff: Liff | null }) {
    const mutation = api.chigiri.create.useMutation();
    const [idToken, setIdToken] = useState<string>();

    useEffect(() => {
        if (liff == null) return;
        const idToken = liff.getIDToken();
        if (idToken != null) setIdToken(idToken);
    }, []);

    const chigiriButton = () => {
        if (liff == null) return <Text>liffが読み込まれていません</Text>;
        // if (!liff.isInClient())
        //     return <QRCodeSVG value={`https://liff.line.me/${env.NEXT_PUBLIC_LIFF_ID}`} includeMargin={true} />;
        if (idToken == null) return <Text>ログイン処理に失敗しています</Text>;
        return (
            <Button
                onClick={async () => {
                    const chigiri = await mutation.mutateAsync({ idToken });
                    await liff.shareTargetPicker([
                        {
                            type: 'text',
                            text: await liff.permanentLink.createUrlBy(`window.location.href/chigiri/${chigiri.id}`),
                        },
                    ]);
                    liff.closeWindow();
                }}
                isLoading={mutation.isLoading}
            >
                相手を定める
            </Button>
        );
    };

    return (
        <>
            <Head>
                <title>チギリ</title>
                <meta name="description" content="これはジョークアプリです" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <div className={styles.container}>
                    <h1 className={styles.title}>
                        神に<span className={styles.pinkSpan}>誓</span>え
                    </h1>
                    <Image src="/chigiri.png" alt="chigiri" width="400px" height="400px" />
                    <p className={styles.showcaseText}>さあ、契りましょう……</p>
                    {chigiriButton()}
                </div>
            </main>
        </>
    );
}
