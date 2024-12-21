'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { FC, useCallback } from 'react';
import MaterialSymbolsDraftRounded from '~icons/material-symbols/draft-rounded';
import MaterialSymbolsPublishRounded from '~icons/material-symbols/publish-rounded';

import { Button } from '@/components/ui/button';

import createArticle from '@/services/api/articles/createArticle';
import { useArticleContext } from '@/services/providers/article-provider';

interface Props {}

const CreateActions: FC<Props> = () => {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const title = useArticleContext((state) => state.title);
    const tags = useArticleContext((state) => state.tags);
    const category = useArticleContext((state) => state.category);
    const getText = useArticleContext((state) => state.getText);

    const { mutate: mutateCreateArticle, isPending } = useMutation({
        mutationFn: createArticle,
        onSuccess: (data) => {
            enqueueSnackbar('Ви успішно створили статтю.', {
                variant: 'success',
            });

            router.push(`/articles/${data.slug}/update`);
        },
    });

    const handleCreateArticle = useCallback(
        (draft: boolean = false) => {
            const text = getText();

            if (!text) {
                return;
            }

            mutateCreateArticle({
                params: {
                    text: text || '',
                    title: title || '',
                    tags,
                    draft,
                    category: category!,
                },
            });
        },
        [getText, title, tags, category, mutateCreateArticle],
    );

    return (
        <div className="flex flex-col gap-4">
            <Button
                disabled={!title || isPending}
                variant="secondary"
                onClick={() => handleCreateArticle(true)}
            >
                <MaterialSymbolsDraftRounded className="size-4" />У чернетку
            </Button>

            <Button
                disabled={!title || isPending}
                onClick={() => handleCreateArticle()}
            >
                <MaterialSymbolsPublishRounded className="size-4" />
                Опублікувати
            </Button>
        </div>
    );
};

export default CreateActions;
