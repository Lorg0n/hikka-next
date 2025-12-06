'use client';

import { useCreateUserSession, useHikkaClient } from '@hikka/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { TurnstileInstance } from '@marsidev/react-turnstile';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
    Form
} from '@/components/ui/form';


import { setCookie } from '@/utils/cookies';
import { validateRedirectUrl } from '@/utils/utils';
import { z } from '@/utils/zod';
import Link from 'next/link';

const formSchema = z.object({
    identifier: z.string().min(5),
    password: z.string().min(8).max(256),
    rememberMe: z.boolean().default(false),
});

const LoginForm = () => {
    const { client } = useHikkaClient();
    const searchParams = useSearchParams();
    const captchaRef = useRef<TurnstileInstance>(undefined);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const callbackUrl = searchParams.get('callbackUrl') ?? '/';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            identifier: '',
            password: '',
            rememberMe: false,
        },
    });

    const mutationLogin = useCreateUserSession({
        options: {
            onSuccess: async (data) => {
                await setCookie('auth', data.secret);
                form.reset();
                client.setAuthToken(data.secret);
                router.push(validateRedirectUrl(callbackUrl));
            },
            onError: () => {
                captchaRef.current?.reset();
            },
        },
    });

    return (
        <Form {...form}>
            <div
                className="space-y-4"
            >
                <Link
                    href={"https://hikka.io/oauth?reference=8dca46ce-c233-4b5f-b895-8684c82c0f1d&scope=all"}
                >
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={
                            mutationLogin.isPending || mutationLogin.isSuccess
                        }
                    >
                        {mutationLogin.isPending && (
                            <span className="loading loading-spinner mr-2"></span>
                        )}
                        Увійти
                    </Button>
                </Link>
            </div>
        </Form>
    );
};

export default LoginForm;