import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';
import { permanentRedirect } from 'next/navigation';
import { FC } from 'react';

import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import Content from '@/features/edit/edit-content/edit-content.component';
import EditForm from '@/features/edit/edit-forms/edit-create-form.component';
import RulesAlert from '@/features/edit/edit-rules-alert.component';

import { prefetchAnimeInfo } from '@/services/hooks/anime/use-anime-info';
import { prefetchCharacterInfo } from '@/services/hooks/characters/use-character-info';
import { prefetchMangaInfo } from '@/services/hooks/manga/use-manga-info';
import { prefetchNovelInfo } from '@/services/hooks/novel/use-novel-info';
import { prefetchPersonInfo } from '@/services/hooks/people/use-person-info';
import getQueryClient from '@/utils/get-query-client';

interface Props {
    searchParams: { [key: string]: string | string[] | undefined };
}

const EditNewPage: FC<Props> = async (props) => {
    const searchParams = await props.searchParams;

    const { content_type, slug } = searchParams;

    const queryClient = getQueryClient();

    if (
        !content_type &&
        !slug &&
        Array.isArray(slug) &&
        Array.isArray(content_type)
    ) {
        permanentRedirect('/edit');
    }

    if (content_type === 'anime') {
        await prefetchAnimeInfo({ slug: String(slug) });
    }

    if (content_type === 'manga') {
        await prefetchMangaInfo({ slug: String(slug) });
    }

    if (content_type === 'novel') {
        await prefetchNovelInfo({ slug: String(slug) });
    }

    if (content_type === 'character') {
        await prefetchCharacterInfo({ slug: String(slug) });
    }

    if (content_type === 'person') {
        await prefetchPersonInfo({ slug: String(slug) });
    }

    const content: API.MainContent | undefined = queryClient.getQueryData([
        content_type,
        slug,
    ]);

    if (!content) {
        permanentRedirect('/edit');
    }

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-16">
                <Block>
                    <Header>
                        <HeaderContainer>
                            <HeaderTitle>Нова правка</HeaderTitle>
                        </HeaderContainer>
                    </Header>
                    <RulesAlert />
                    <EditForm
                        slug={slug as string}
                        content_type={content_type as API.ContentType}
                        content={content}
                    />
                </Block>
                <div className="flex flex-col gap-12">
                    <Content
                        slug={slug as string}
                        content_type={content_type as API.ContentType}
                        content={content}
                    />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default EditNewPage;
