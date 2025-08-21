'use client';

import { AnimeScheduleResponse } from '@hikka/client';
import { FC, memo } from 'react';

import H5 from '@/components/typography/h5';
import P from '@/components/typography/p';
import HorizontalContentCard, {
    Props as HorizontalContentCardProps,
} from '@/components/ui/horizontal-content-card';
import WatchlistButton from '@/components/watchlist-button/watchlist-button';

import getScheduleDuration from '@/utils/get-schedule-duration';
import { cn } from '@/utils/utils';

interface Props extends Omit<HorizontalContentCardProps, 'title' | 'href'> {
    item: AnimeScheduleResponse;
}

const ScheduleItem: FC<Props> = ({ item, ...props }) => {
    const getDuration = () => {
        if (item.time_left <= 0) {
            return 'Вийшло';
        }

        return getScheduleDuration(item.airing_at, item.time_left);
    };

    return (
        <HorizontalContentCard
            title={item.anime.title!}
            href={`/anime/${item.anime.slug}`}
            description={
                item.anime.synopsis_ua || item.anime.synopsis_en || undefined
            }
            image={item.anime.image || undefined}
            {...props}
        >
            <div className="flex w-full gap-4 items-end">
                <div className="flex flex-col justify-between gap-2 flex-1">
                    <P className="text-muted-foreground text-sm">
                        <span className="text-foreground font-bold">
                            {item.episode}
                        </span>
                        /{item.anime.episodes_total || '?'}
                    </P>
                    <H5
                        className={cn(
                            item.time_left <= 0 && 'text-muted-foreground',
                        )}
                    >
                        {getDuration()}
                    </H5>
                </div>

                <WatchlistButton
                    slug={item.anime.slug}
                    anime={item.anime}
                    watch={item.anime.watch[0] ?? null}
                    size={'icon-sm'}
                />
            </div>
        </HorizontalContentCard>
    );
};

export default memo(ScheduleItem);
