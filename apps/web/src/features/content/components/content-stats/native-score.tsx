'use client';

import { BarChart, Star } from 'lucide-react';
import { FC, ReactNode } from 'react';
import { NumericFormat } from 'react-number-format';

import P from '@/components/typography/p';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/utils';

interface NativeData {
    native_score: number | null;
    native_scored_by: number | null;
}

const ScoreDetailItem: FC<{
    title: string;
    children: ReactNode;
    icon?: ReactNode;
}> = ({ title, children, icon }) => {
    return (
        <div className="grid grid-cols-2 items-center justify-between gap-2">
            <div className="flex items-center gap-3 text-muted-foreground">
                {icon}
                <Label>{title}</Label>
            </div>
            <div className="text-right">{children}</div>
        </div>
    );
};

interface Props {
    data: NativeData | undefined;
}

const NativeScore: FC<Props> = ({ data }) => {
    if (!data || !data.native_score || !data.native_scored_by) {
        return null;
    }

    const getScoreColorClass = (score: number) => {
        if (score >= 8.0) return 'text-success-foreground';
        if (score >= 6.0) return 'text-info-foreground';
        if (score >= 5.0) return 'text-warning-foreground';
        return 'text-destructive-foreground';
    };

    const scoreColorClass = getScoreColorClass(data.native_score);

    return (
        <Card className="flex flex-col gap-3 bg-secondary/20 p-4 backdrop-blur">
            <ScoreDetailItem
                title="Середня оцінка"
                icon={<Star className="size-4 shrink-0" />}
            >
                <P className={cn('text-sm font-medium', scoreColorClass)}>
                    {data.native_score.toFixed(2)}
                </P>
            </ScoreDetailItem>

            <ScoreDetailItem
                title="Всього оцінок"
                icon={<BarChart className="size-4 shrink-0" />}
            >
                <NumericFormat
                    value={data.native_scored_by}
                    displayType="text"
                    thousandSeparator=","
                    className="text-sm font-medium"
                />
            </ScoreDetailItem>
        </Card>
    );
};

export default NativeScore;