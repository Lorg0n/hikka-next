'use client';

import { useConfirmPasswordReset } from '@hikka/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

import FormInput from '@/components/form/form-input';
import H2 from '@/components/typography/h2';
import Small from '@/components/typography/small';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { useModalContext } from '@/services/providers/modal-provider';
import { setCookie } from '@/utils/cookies';
import { z } from '@/utils/zod';

const formSchema = z
    .object({
        password: z.string().min(6),
        passwordConfirmation: z.string().min(6),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: 'Паролі не збігаються',
        path: ['passwordConfirmation'],
    });

const Component = () => {
    const searchParams = useSearchParams();
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const { closeModal } = useModalContext();

    const token = searchParams.get('token')!;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const mutationConfirmPasswordReset = useConfirmPasswordReset({
        options: {
            onSuccess: async (data) => {
                await setCookie('auth', data.secret);
                form.reset();
                closeModal();
                router.push('/anime');
                enqueueSnackbar('Ви успішно змінили Ваш пароль.', {
                    variant: 'success',
                });
            },
        },
    });

    return (
        <div className="w-full space-y-4">
            <div className="flex w-full flex-col items-center gap-4 text-center">
                <div>
                    <H2 className="text-primary">🔓 Відновити пароль</H2>
                    <Small className="text-muted-foreground mt-2">
                        Будь ласка, введіть новий пароль.
                    </Small>
                </div>
            </div>
            <Form {...form}>
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex w-full flex-col gap-4 text-left"
                >
                    <FormInput
                        type="password"
                        name="password"
                        placeholder="Введіть пароль"
                        label="Пароль"
                        description="Не менше 8 символів."
                    />

                    <FormInput
                        type="password"
                        name="passwordConfirmation"
                        placeholder="Повторіть пароль"
                        label="Підтвердження паролю"
                    />

                    <div className="flex w-full flex-col gap-4">
                        <Button
                            onClick={form.handleSubmit((data) =>
                                mutationConfirmPasswordReset.mutate({
                                    password: data.password,
                                    token,
                                }),
                            )}
                            disabled={mutationConfirmPasswordReset.isPending}
                            type="submit"
                            className="w-full"
                        >
                            {mutationConfirmPasswordReset.isPending && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Відновити
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default Component;
