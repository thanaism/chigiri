import { Button } from '@chakra-ui/react';
import type { Liff } from '@line/liff';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';

export default function Chigiri({ liff }: { liff: Liff | null }) {
    const router = useRouter();
    const id = router.query.id as string;
    const query = api.chigiri.get.useQuery({ id }, { enabled: id != null });
    const update = api.chigiri.update.useMutation();
    const delete_ = api.chigiri.delete.useMutation();
    const { data: chigiri } = query;

    return (
        <>
            <h1>{chigiri?.senderName}との契り</h1>
            <p>{chigiri?.content}</p>
            <Button
                onClick={async () => {
                    if (liff == null) return alert('liffが読み込まれていません');
                    const idToken = liff.getIDToken();
                    if (idToken == null) return alert('ログイン処理に失敗しています');
                    await update.mutateAsync({ id, idToken });
                }}
            >
                契る
            </Button>
            <Button
                onClick={async () => {
                    await delete_.mutateAsync({ id });
                }}
                colorScheme="red"
            >
                破る
            </Button>
        </>
    );
}
