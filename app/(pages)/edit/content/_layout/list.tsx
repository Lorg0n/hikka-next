'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import AnimeCard from '@/app/_components/anime-card';
import { Button } from '@/app/_components/ui/button';
import { Combobox } from '@/app/_components/ui/combobox';
import getTodoAnime from '@/utils/api/edit/todo/getTodoAnime';
import useInfiniteList from '@/utils/hooks/useInfiniteList';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { useSettingsContext } from '@/utils/providers/settings-provider';
import SkeletonCard from '@/app/_components/skeletons/entry-card';
import { range } from '@antfu/utils';

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const { titleLanguage } = useSettingsContext();
    const { secret } = useAuthContext();
    const { ref, inView } = useInView();
    const [param, setParam] = useState('title_ua');

    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        useInfiniteList({
            queryKey: ['list', param, secret],
            queryFn: ({ pageParam = 1 }) =>
                getTodoAnime({
                    param: param,
                    secret: String(secret),
                }),
        });

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView]);

    if (isLoading && !isFetchingNextPage) {
        return (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-6 lg:gap-8">
                {range(1, 20).map((v) => (
                    <SkeletonCard key={v} />
                ))}
            </div>
        );
    }

    if (!list || list.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex gap-2">
                <Combobox
                    options={[
                        { value: 'title_ua', label: 'Аніме без назв' },
                        {
                            value: 'synopsis_ua',
                            label: 'Аніме без опису',
                        },
                    ]}
                    value={param}
                    toggleProps={{ variant: 'ghost' }}
                    onChange={(value) => setParam(value)}
                    renderValue={(option) =>
                        !Array.isArray(option) &&
                        option && (
                            <div className="flex items-center gap-2">
                                <h3>{option.label}</h3>
                            </div>
                        )
                    }
                />
            </div>
            <div
                className={clsx(
                    'grid grid-cols-2 gap-4 md:grid-cols-6 lg:gap-8',
                    extended && 'md:grid-cols-5',
                )}
            >
                {list.map((anime) => (
                    <AnimeCard
                        key={anime.slug}
                        watch={
                            anime.watch.length > 0 ? anime.watch[0] : undefined
                        }
                        slug={anime.slug}
                        href={`/anime/${anime.slug}`}
                        poster={anime.poster}
                        title={
                            anime[titleLanguage!] ||
                            anime.title_ua ||
                            anime.title_en ||
                            anime.title_ja
                        }
                        posterClassName="!h-[calc(100%+2rem)] absolute -top-1 left-0"
                    />
                ))}
            </div>
            {hasNextPage && (
                <Button
                    variant="secondary"
                    ref={ref}
                    disabled={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                >
                    {isFetchingNextPage && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Заванатажити ще
                </Button>
            )}
        </div>
    );
};

export default Component;