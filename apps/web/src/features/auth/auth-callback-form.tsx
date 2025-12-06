'use client';

import { useHikkaClient } from '@hikka/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';


import { setCookie } from '@/utils/cookies';
import { validateRedirectUrl } from '@/utils/utils';

interface AuthResponse {
    expires: number;
    secret: string;
    hikkaSecret: string;
}

const AuthCallbackForm = () => {
    const { client } = useHikkaClient();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reference = searchParams.get('reference');
    const callbackUrl = searchParams.get('callbackUrl') ?? '/';

    useEffect(() => {
        const handleAuthCallback = async () => {
            if (!reference) {
                setError('Відсутній параметр reference');
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `https://hikka-forge.lorgon.dev/auth/hikka/callback?reference=${encodeURIComponent(reference)}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: AuthResponse = await response.json();

                if (!data.hikkaSecret) {
                    throw new Error('Недійсний відповідь від сервера');
                }

                // Set the auth cookie
                await setCookie('auth', data.hikkaSecret);

                // Set the client auth token
                client.setAuthToken(data.secret);

                // Redirect to the callback URL or home
                router.push(validateRedirectUrl(callbackUrl));
                router.refresh();

                toast.success('Ви успішно авторизувалися!');
            } catch (error) {
                console.error('Auth callback error:', error);
                setError(error instanceof Error ? error.message : 'Помилка авторизації');
                toast.error('Помилка авторизації. Будь ласка, спробуйте ще раз.');
            } finally {
                setIsLoading(false);
            }
        };

        handleAuthCallback();
    }, [reference, callbackUrl, client, router]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
                {isLoading && (
                    <>
                        <span className="loading loading-spinner"></span>
                        <span>Авторизація...</span>
                    </>
                )}
            </div>

            {error && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-destructive">
                    {error}
                </div>
            )}
        </div>
    );
};

export default AuthCallbackForm;
