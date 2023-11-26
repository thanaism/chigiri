import { Button } from '@chakra-ui/react';
import { api } from '~/utils/api';

export default function Publish() {
    const mutation = api.blockchain.publish.useMutation();

    return (
        <Button
            onClick={() => {
                const n = 10;
                for (let i = 0; i < n; i++) mutation.mutate({});
            }}
        >
            publish
        </Button>
    );
}
