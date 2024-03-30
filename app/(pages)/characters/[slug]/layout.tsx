import { Metadata, ResolvingMetadata } from 'next';
import React, { PropsWithChildren } from 'react';

import Link from 'next/link';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import { getCookie } from '@/utils/actions';
import Breadcrumbs from '@/components/navbar/nav-breadcrumbs';
import InternalNavBar from '@/components/navbar/nav-tabs';
import NavMenu from '@/components/navbar/nav-dropdown';
import SubBar from '@/components/navbar/sub-nav';
import getCharacterAnime from '@/services/api/characters/getCharacterAnime';
import getCharacterInfo, {
    Response as CharacterResponse,
} from '@/services/api/characters/getCharacterInfo';
import getCharacterVoices from '@/services/api/characters/getCharacterVoices';
import getFavourite from '@/services/api/favourite/getFavourite';
import { CHARACTER_NAV_ROUTES } from '@/utils/constants';
import getQueryClient from '@/utils/getQueryClient';

import Cover from '@/app/(pages)/characters/[slug]/components/cover';
import Title from '@/app/(pages)/characters/[slug]/components/title';
import { redirect } from 'next/navigation';


interface Props extends PropsWithChildren {
    params: {
        slug: string;
    };
}

// export const runtime = 'edge';

export async function generateMetadata(
    {
        params,
    }: {
        params: {
            slug: string;
        };
    },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const parentMetadata = await parent;
    const slug = params.slug;

    const character: CharacterResponse = await getCharacterInfo({ slug });
    const title = character.name_ua || character.name_en || character.name_ja;

    return {
        title: { default: title, template: title + ' / %s / Hikka' },
        description: undefined,
        openGraph: {
            siteName: parentMetadata.openGraph?.siteName,
            title: { default: title, template: title + ' / %s / Hikka' },
            description: undefined,
            images: character.image,
        },
        twitter: {
            title: { default: title, template: title + ' / %s / Hikka' },
            description: undefined,
            images: character.image,
        },
    };
}

const CharacterLayout = async ({ params: { slug }, children }: Props) => {
    const queryClient = getQueryClient();
    const auth = await getCookie('auth');

    const character = await queryClient.fetchQuery({
        queryKey: ['character', slug],
        queryFn: () => getCharacterInfo({ slug }),
    });

    if (!character) {
        return redirect('/');
    }

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['characterAnime', slug],
        queryFn: () => getCharacterAnime({ slug }),
        initialPageParam: 1,
    });

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['characterVoices', slug],
        queryFn: () => getCharacterVoices({ slug }),
        initialPageParam: 1,
    });

    await queryClient.prefetchQuery({
        queryKey: ['favorite', slug, { auth, content_type: 'character' }],
        queryFn: () =>
            getFavourite({
                slug: String(slug),
                auth: String(auth),
                content_type: 'character',
            }),
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <>
                <Breadcrumbs>
                    <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                        <Link
                            href={'/characters/' + character?.slug}
                            className="flex-1 overflow-hidden text-ellipsis text-sm font-bold hover:underline"
                        >
                            {character?.name_ua ||
                                character?.name_en ||
                                character?.name_ja}
                        </Link>
                    </div>
                    <NavMenu
                        routes={CHARACTER_NAV_ROUTES}
                        urlPrefix={'/characters/' + slug}
                    />
                </Breadcrumbs>
                <SubBar mobileOnly>
                    <InternalNavBar
                        routes={CHARACTER_NAV_ROUTES}
                        urlPrefix={'/characters/' + slug}
                    />
                </SubBar>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[20%_1fr] lg:gap-16">
                    <div className="flex flex-col gap-4">
                        <Cover />
                    </div>
                    <div className="flex flex-col gap-12">
                        <Title />
                        {children}
                    </div>
                </div>
            </>
        </HydrationBoundary>
    );
};

export default CharacterLayout;
