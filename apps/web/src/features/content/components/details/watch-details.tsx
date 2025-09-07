'use client';

import { AnimeInfoResponse, AnimeStatusEnum } from '@hikka/client';
import { format, formatDuration, intervalToDuration } from 'date-fns';
import {
    BookType,
    Building2,
    CalendarClock,
    CircleDashed,
    Clock8,
    Hash,
    Play,
    ShieldEllipsis,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import P from '@/components/typography/p';
import { Badge } from '@/components/ui/badge';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import {
    AGE_RATING,
    ANIME_MEDIA_TYPE,
    RELEASE_STATUS,
} from '@/utils/constants/common';
import getScheduleDuration from '@/utils/get-schedule-duration';
import { cn } from '@/utils/utils';

import DetailItem from './detail-item';

// Utility functions
const formatEpisodeDuration = (duration: number) =>
    formatDuration(
        intervalToDuration({
            start: 0,
            end: duration * 60 * 1000,
        }),
    );

const formatEpisodeCount = (
    status: string,
    episodesReleased: number | null,
    episodesTotal: number | null,
) => {
    if (status === AnimeStatusEnum.FINISHED) {
        return episodesTotal?.toString() ?? '?';
    }
    return `${episodesReleased ?? '?'} / ${episodesTotal ?? '?'}`;
};

const formatNextEpisodeDate = (airingAt: number) =>
    format(new Date(airingAt * 1000), 'd MMMM HH:mm');

// Component helpers
const NextEpisodeDetail = ({
    schedule,
}: {
    schedule: { airing_at: number };
}) => (
    <DetailItem
        icon={<CalendarClock className="size-4" />}
        title="Наступний епізод"
    >
        <Tooltip>
            <TooltipTrigger>
                <Label>{formatNextEpisodeDate(schedule.airing_at)}</Label>
            </TooltipTrigger>
            <TooltipContent>
                <P>{getScheduleDuration(schedule.airing_at)}</P>
            </TooltipContent>
        </Tooltip>
    </DetailItem>
);

const StudioDetail = ({
    studio,
}: {
    studio: { company: { name: string; slug: string; image?: string | null } };
}) => (
    <DetailItem title="Студія" icon={<Building2 className="size-4" />}>
        <div className="flex items-center gap-2">
            <Label asChild className="line-clamp-2 flex-1 hover:underline">
                <Link href={`/anime?studios=${studio.company.slug}`}>
                    {studio.company.name}
                </Link>
            </Label>
            {studio.company.image && (
                <Link href={`/anime?studios=${studio.company.slug}`}>
                    <Image
                        src={studio.company.image}
                        alt="studio"
                        width={100}
                        height={50}
                        className="w-8 rounded-sm object-cover"
                    />
                </Link>
            )}
        </div>
    </DetailItem>
);

const StatusBadge = ({ status }: { status: string }) => (
    <Badge
        variant="status"
        className={cn(
            `bg-${status} text-${status}-foreground border-${status}-border`,
        )}
    >
        {RELEASE_STATUS[status as keyof typeof RELEASE_STATUS]?.title_ua}
    </Badge>
);

const WatchDetails = ({
    className,
    data,
}: {
    className?: string;
    data: AnimeInfoResponse;
}) => {
    const nextEpisodeSchedule = data.schedule.find(
        (s) => s.airing_at * 1000 > Date.now(),
    );
    const studio = data.companies.find((c) => c.type === 'studio');

    return (
        <Card className={cn('bg-secondary/20 backdrop-blur', className)}>
            {/* Basic Info Section */}
            <DetailItem
                icon={<Play className="size-4" />}
                title="Тип"
                value={
                    data.media_type
                        ? ANIME_MEDIA_TYPE[data.media_type].title_ua
                        : undefined
                }
            />

            <DetailItem
                title="Статус"
                icon={<CircleDashed className="size-4" />}
            >
                {data.status && <StatusBadge status={data.status} />}
            </DetailItem>

            {(data.episodes_total || data.episodes_released) && (
                <div className="h-px bg-border" />
            )}

            {/* Episode Info Section */}
            <DetailItem
                icon={<Hash className="size-4" />}
                title="Епізоди"
                value={
                    data.episodes_total && data.media_type !== 'movie'
                        ? formatEpisodeCount(
                              data.status!,
                              data.episodes_released,
                              data.episodes_total,
                          )
                        : undefined
                }
            />

            {nextEpisodeSchedule && (
                <NextEpisodeDetail schedule={nextEpisodeSchedule} />
            )}

            <DetailItem
                icon={<Clock8 className="size-4" />}
                title="Тривалість епізоду"
                value={
                    data.duration
                        ? formatEpisodeDuration(data.duration)
                        : undefined
                }
            />

            <div className="h-px bg-border" />

            {/* Additional Info Section */}
            <DetailItem
                icon={<ShieldEllipsis className="size-4" />}
                title="Рейтинг"
                value={
                    data.rating ? AGE_RATING[data.rating].title_ua : undefined
                }
            />

            {studio && <StudioDetail studio={studio} />}

            {data.synonyms.length > 0 && <div className="h-px bg-border" />}

            <DetailItem
                icon={<BookType className="size-4" />}
                title="Синоніми"
                value={data.synonyms}
            />
        </Card>
    );
};

export default WatchDetails;
