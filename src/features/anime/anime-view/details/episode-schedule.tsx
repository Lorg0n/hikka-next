import { format } from 'date-fns/format';
import { formatDuration } from 'date-fns/formatDuration';
import { intervalToDuration } from 'date-fns/intervalToDuration';
import { FC } from 'react';

import P from '@/components/typography/p';
import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface Props {
    schedule: API.Schedule[];
}

const EpisodeSchedule: FC<Props> = ({ schedule }) => {
    if (!schedule) {
        return null;
    }

    const nextEpisodeSchedule = schedule.find(
        (s) => s.airing_at * 1000 > Date.now(),
    );

    if (!nextEpisodeSchedule) {
        return null;
    }

    return (
        <div className="flex flex-wrap">
            <div className="w-24">
                <Label className="text-muted-foreground">
                    Наступний епізод:
                </Label>
            </div>
            <div className="flex-1">
                <Tooltip>
                    <TooltipTrigger>
                        <Label>
                            {format(
                                new Date(nextEpisodeSchedule.airing_at * 1000),
                                'd MMMM HH:mm',
                            )}
                        </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                        <P>
                            {formatDuration(
                                intervalToDuration({
                                    start: nextEpisodeSchedule.airing_at * 1000,
                                    end: Date.now(),
                                }),
                            )}
                        </P>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    );
};

export default EpisodeSchedule;
