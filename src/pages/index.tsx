import Head from 'next/head';
import { api } from '~/utils/api';
import styles from './index.module.css';
import type { Liff } from '@line/liff';
import { Button, FormControl, FormErrorMessage, FormLabel, Image, Input, Text } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

export default function Home({ liff }: { liff: Liff | null }) {
    const mutation = api.chigiri.create.useMutation();
    const { watch, register, reset, formState } = useForm<{ content: string }>();
    const { errors } = formState;
    const content = watch('content');

    const chigiriButton = () => {
        if (liff == null) return <Text>liffが読み込まれていません</Text>;
        return (
            <Button
                isDisabled={!!errors.content || !content}
                onClick={async () => {
                    const idToken = liff.getIDToken();
                    if (idToken == null) return alert('ログイン処理に失敗しています');
                    const displayName = (await liff.getProfile()).displayName;
                    const chigiri = await mutation.mutateAsync({ idToken, content, senderName: displayName });
                    const url = await liff.permanentLink.createUrlBy(`${window.location.origin}/chigiri/${chigiri.id}`);
                    await liff.shareTargetPicker([
                        {
                            type: 'flex',
                            altText: '契りを交わしてください',
                            contents: {
                                type: 'bubble',
                                hero: {
                                    type: 'image',
                                    url: `${window.location.origin}/scroll.png`,
                                    size: 'full',
                                    aspectRatio: '20:13',
                                    aspectMode: 'cover',
                                },
                                body: {
                                    type: 'box',
                                    layout: 'vertical',
                                    contents: [
                                        { type: 'text', text: '契りを交わしてください', weight: 'bold', size: 'xl' },
                                        {
                                            type: 'box',
                                            layout: 'vertical',
                                            margin: 'lg',
                                            spacing: 'sm',
                                            contents: [
                                                {
                                                    type: 'box',
                                                    layout: 'baseline',
                                                    spacing: 'sm',
                                                    contents: [
                                                        {
                                                            type: 'text',
                                                            text: '相手',
                                                            color: '#aaaaaa',
                                                            size: 'sm',
                                                            flex: 1,
                                                        },
                                                        {
                                                            type: 'text',
                                                            text: displayName,
                                                            wrap: true,
                                                            color: '#666666',
                                                            size: 'sm',
                                                            flex: 5,
                                                        },
                                                    ],
                                                },
                                                {
                                                    type: 'box',
                                                    layout: 'baseline',
                                                    spacing: 'sm',
                                                    contents: [
                                                        {
                                                            type: 'text',
                                                            text: '内容',
                                                            color: '#aaaaaa',
                                                            size: 'sm',
                                                            flex: 1,
                                                        },
                                                        {
                                                            type: 'text',
                                                            text: content,
                                                            wrap: true,
                                                            color: '#666666',
                                                            size: 'sm',
                                                            flex: 5,
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                footer: {
                                    type: 'box',
                                    layout: 'vertical',
                                    spacing: 'sm',
                                    contents: [
                                        {
                                            type: 'button',
                                            style: 'link',
                                            height: 'sm',
                                            action: {
                                                type: 'uri',
                                                label: '契りを確認する',
                                                uri: url,
                                            },
                                        },
                                    ],
                                    flex: 0,
                                },
                            },
                        },
                    ]);
                    reset({ content: '' });
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
                    <Image src="/chigiri.png" alt="chigiri" width="200px" height="200px" />
                    <p className={styles.showcaseText}>さあ、契りましょう</p>
                    <FormControl isInvalid={!!errors.content}>
                        <FormLabel htmlFor="content">契りの内容</FormLabel>
                        <Input
                            id="content"
                            placeholder="契りの内容"
                            {...register('content', { required: true })}
                            bgColor="white"
                        />
                        <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
                    </FormControl>
                    {chigiriButton()}
                </div>
            </main>
        </>
    );
}
