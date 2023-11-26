import { Button } from '@chakra-ui/react';
import { api } from '~/utils/api';

export default function Enqueue() {
    const mutation = api.blockchain.enqueue.useMutation();

    return (
        <Button
            onClick={() => {
                const n = 10;
                for (let i = 0; i < n; i++) mutation.mutate({});
            }}
        >
            enqueue
        </Button>
    );
}
