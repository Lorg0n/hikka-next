'use client';

import { useParams } from 'next/navigation';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import getAnimeFranchise, {
    Response as AnimeFranchiseResponse,
} from '@/utils/api/anime/getAnimeFranchise';
import AnimeCard from '@/app/_components/AnimeCard';
import { Response as AnimeInfoResponse } from '@/utils/api/anime/getAnimeInfo';
import SubHeader from '@/app/_components/SubHeader';
import {useInView} from "react-intersection-observer";
import {useEffect} from "react";

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const { ref, inView } = useInView();
    const params = useParams();
    const queryClient = useQueryClient();
    const anime: AnimeInfoResponse | undefined = queryClient.getQueryData([
        'anime',
        params.slug,
    ]);

    if (!anime || !anime.has_franchise) {
        return null;
    }

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['franchise', params.slug],
        getNextPageParam: (lastPage: AnimeFranchiseResponse, allPages) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? undefined : nextPage;
        },
        queryFn: ({ pageParam = 1 }) =>
            getAnimeFranchise({ slug: String(params.slug), page: pageParam }),
    });

    useEffect(() => {
        if (inView && data) {
            fetchNextPage();
        }
    }, [inView])

    if (!data || !data.pages) {
        return null;
    }

    const list = data.pages.map((data) => data.list).flat(1);

    const filterSelfData = list.filter((anime) => anime.slug !== params.slug);
    const filteredData = extended ? filterSelfData : filterSelfData.slice(0, 5);

    return (
        <div className="flex flex-col gap-8">
            <SubHeader
                title={`Пов’язане`}
                href={!extended ? params.slug + '/franchise' : undefined}
            />
            <div className="grid md:grid-cols-5 grid-cols-2 gap-4 lg:gap-8">
                {filteredData.map((anime) => (
                    <AnimeCard
                        key={anime.slug}
                        slug={anime.slug}
                        href={`/anime/${anime.slug}`}
                        poster={anime.poster}
                        title={
                            anime.title_ua || anime.title_en || anime.title_ja
                        }
                        posterClassName="!h-[calc(100%+2rem)] absolute -top-1 left-0"
                    />
                ))}
            </div>
            {extended && hasNextPage && (
                <button
                    ref={ref}
                    disabled={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                    className="btn btn-secondary"
                >
                    {isFetchingNextPage && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Заванатажити ще
                </button>
            )}
        </div>
    );
};

export default Component;
