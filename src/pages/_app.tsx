import type { AppProps } from 'next/app';

import { api } from '~/utils/api';

import '~/styles/globals.css';
import { useEffect, useState } from 'react';
import { env } from '~/env';
import { Center, ChakraProvider, Spinner } from '@chakra-ui/react';
import type { Liff } from '@line/liff';

const MyApp = ({ Component, pageProps }: AppProps<{ liff: Liff | null; liffError: string | null }>) => {
    const [liffObject, setLiffObject] = useState<Liff | null>(null);
    const [liffError, setLiffError] = useState<string | null>(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        // to avoid `window is not defined` error
        void import('@line/liff')
            .then((liff) => liff.default)
            .then((liff) => {
                console.log('LIFF init...');
                liff.init({
                    liffId: env.NEXT_PUBLIC_LIFF_ID,
                    withLoginOnExternalBrowser: true,
                })
                    .then(() => {
                        console.log('LIFF init succeeded.');
                        setLiffObject(liff);
                        setInitialized(true);
                    })
                    .catch((error: Error) => {
                        console.log('LIFF init failed.');
                        setLiffError(error.toString());
                    });
            });
    }, []);

    pageProps.liff = liffObject;
    pageProps.liffError = liffError;

    if (!initialized)
        return (
            <Center minH="100dvh" minW="100dvw">
                <Center minH="100dvh" minW="100dvw">
                    <Spinner size="xl" />
                </Center>
            </Center>
        );

    return (
        <ChakraProvider>
            <Component {...pageProps} />
        </ChakraProvider>
    );
};

export default api.withTRPC(MyApp);
