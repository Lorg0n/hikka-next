import { Metadata, ResolvingMetadata } from 'next';
import React, { PropsWithChildren } from 'react';

import Link from 'next/link';

import { dehydrate } from '@tanstack/query-core';

import Actions from '@/app/(pages)/anime/[slug]/_layout/Actions';
import Cover from '@/app/(pages)/anime/[slug]/_layout/Cover';
import NavMenu from '@/app/(pages)/anime/[slug]/_layout/NavMenu';
import Title from '@/app/(pages)/anime/[slug]/_layout/Title';
import Breadcrumbs from '@/app/_components/Breadcrumbs';
import SubBar from '@/app/_components/SubBar';
import { getCookie } from '@/app/actions';
import RQHydrate from '@/utils/RQHydrate';
import getAnimeCharacters from '@/utils/api/anime/getAnimeCharacters';
import getAnimeFranchise from '@/utils/api/anime/getAnimeFranchise';
import getAnimeInfo, {
    Response as AnimeResponse,
} from '@/utils/api/anime/getAnimeInfo';
import getAnimeStaff from '@/utils/api/anime/getAnimeStaff';
import { RELEASE_STATUS } from '@/utils/constants';
import getQueryClient from '@/utils/getQueryClient';

import NavBar from './_layout/NavBar';

interface Props extends PropsWithChildren {
    params: {
        slug: string;
    };
}

export const runtime = 'edge';

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
    const slug = params.slug;

    const anime: AnimeResponse = await getAnimeInfo({ slug });
    const startDate = anime.start_date
        ? new Date(anime.start_date * 1000).getFullYear()
        : null;
    const title =
        (anime.title_ua || anime.title_en || anime.title_ja) +
        (startDate ? ` (${startDate})` : '');
    let synopsis: string | undefined = anime.synopsis_ua || anime.synopsis_en;

    synopsis =
        synopsis &&
        (synopsis.length > 150
            ? synopsis.substring(
                  0,
                  150 + synopsis.substring(150).indexOf(' '),
              ) + '...'
            : synopsis.length > 0
              ? synopsis + '...'
              : undefined);

    return {
        title: { default: title, template: title + ' / %s / Hikka' },
        description: synopsis,
        openGraph: {
            title: { default: title, template: title + ' / %s / Hikka' },
            description: synopsis,
            images: anime.poster,
        },
        twitter: {
            title: { default: title, template: title + ' / %s / Hikka' },
            description: synopsis,
            images: anime.poster,
        },
    };
}

const Component = async ({ params: { slug }, children }: Props) => {
    const queryClient = getQueryClient();
    const secret = await getCookie('secret');

    await queryClient.prefetchQuery(['anime', slug], () =>
        getAnimeInfo({ slug }),
    );
    await queryClient.prefetchInfiniteQuery(['characters', slug], () =>
        getAnimeCharacters({ slug }),
    );

    await queryClient.prefetchInfiniteQuery(['franchise', slug, secret], () =>
        getAnimeFranchise({ slug, secret }),
    );
    await queryClient.prefetchInfiniteQuery(['staff', slug], () =>
        getAnimeStaff({ slug }),
    );

    const anime: Hikka.Anime | undefined = queryClient.getQueryData([
        'anime',
        slug,
    ]);

    const dehydratedState = dehydrate(queryClient);

    return (
        <RQHydrate state={dehydratedState}>
            <>
                <Breadcrumbs>
                    <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                        <div
                            className="h-2 w-2 rounded-full bg-white"
                            style={{
                                backgroundColor:
                                    RELEASE_STATUS[
                                        anime?.status as Hikka.Status
                                    ].color,
                            }}
                        />
                        <Link
                            href={'/anime/' + anime?.slug}
                            className="flex-1 overflow-hidden overflow-ellipsis text-sm font-bold hover:underline"
                        >
                            {anime?.title_ua ||
                                anime?.title_en ||
                                anime?.title_ja}
                        </Link>
                    </div>
                    <NavMenu />
                </Breadcrumbs>
                <SubBar mobileOnly>
                    <NavBar />
                </SubBar>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[20%_1fr] lg:gap-16">
                    <div className="flex flex-col gap-4">
                        <Cover />
                        <div className="flex w-full flex-col gap-12 lg:sticky lg:top-20 lg:self-start">
                            <Actions />
                        </div>
                    </div>
                    <div className="flex flex-col gap-12">
                        <Title />
                        {children}
                    </div>
                </div>
            </>
        </RQHydrate>
    );
};

export default Component;
