'use client';

import { useRequestPasswordReset } from '@hikka/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

import FormInput from '@/components/form/form-input';
import H2 from '@/components/typography/h2';
import Small from '@/components/typography/small';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { useModalContext } from '@/services/providers/modal-provider';
import { z } from '@/utils/zod';

import AuthModal from './auth-modal.component';

const formSchema = z.object({
    email: z.string().email(),
});

const Component = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { openModal, closeModal } = useModalContext();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const mutationRequestPasswordReset = useRequestPasswordReset({
        options: {
            onSuccess: (data) => {
                closeModal();
                enqueueSnackbar(
                    <span>
                        <span className="font-bold">{data.username}</span>, ми
                        успішно надіслали Вам лист для відновлення паролю на
                        вашу поштову адресу.
                    </span>,
                    { variant: 'info' },
                );
            },
        },
    });

    const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
        mutationRequestPasswordReset.mutate(data);
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex w-full flex-col items-center gap-4 text-center">
                <div>
                    <H2 className="text-primary">🔐 Відновити пароль</H2>
                    <Small className="text-muted-foreground mt-2">
                        Будь ласка, введіть дані для отримання листа
                        відновлення.
                    </Small>
                </div>
            </div>
            <Form {...form}>
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex w-full flex-col gap-4 text-left"
                >
                    <FormInput
                        type="email"
                        name="email"
                        placeholder="Введіть пошту"
                        label="Email"
                    />

                    <div className="flex w-full flex-col gap-4">
                        <Button
                            onClick={form.handleSubmit(handleFormSubmit)}
                            disabled={mutationRequestPasswordReset.isPending}
                            type="submit"
                            className="w-full"
                        >
                            {mutationRequestPasswordReset.isPending && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Відновити
                        </Button>
                        <Button
                            variant="secondary"
                            disabled={mutationRequestPasswordReset.isPending}
                            onClick={() =>
                                openModal({
                                    content: <AuthModal type="login" />,
                                    className: 'max-w-3xl p-0',
                                    forceModal: true,
                                })
                            }
                            className="w-full"
                        >
                            Авторизація
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default Component;
