import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import P from '@/components/typography/p';
import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface Props {
    companies: API.CompanyWithType[];
}

const Studio: FC<Props> = ({ companies }) => {
    if (!companies) {
        return null;
    }

    const studio = companies.find((c) => c.type === 'studio');

    if (!studio) {
        return null;
    }

    return (
        <div className="flex flex-wrap">
            <div className="w-24">
                <Label className="text-muted-foreground">Студія:</Label>
            </div>
            <div className="flex-1">
                {studio.company.image ? (
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                            <Link
                                href={`/anime?studios=${studio.company.slug}`}
                            >
                                <Image
                                    src={studio.company.image}
                                    alt="studio"
                                    width={100}
                                    height={50}
                                    className="w-16 rounded-md object-cover"
                                />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <P className="text-sm">{studio.company.name}</P>
                        </TooltipContent>
                    </Tooltip>
                ) : (
                    <Label>
                        <Link href={`/anime?studios=${studio.company.slug}`}>
                            {studio.company.name}
                        </Link>
                    </Label>
                )}
            </div>
        </div>
    );
};

export default Studio;
