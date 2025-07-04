'use client';

import { useUserByUsername } from '@hikka/react';
import { useParams } from 'next/navigation';

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import MaterialSymbolsSecurity from '../../components/icons/material-symbols/MaterialSymbolsSecurity';
import MaterialSymbolsShieldPerson from '../../components/icons/material-symbols/MaterialSymbolsShieldPerson';
import MDViewer from '../../components/markdown/viewer/MD-viewer';
import H3 from '../../components/typography/h3';
import P from '../../components/typography/p';

const UserTitle = () => {
    const params = useParams();
    const { data: user } = useUserByUsername({
        username: String(params.username),
    });

    if (!user) {
        return null;
    }

    return (
        <div className="flex w-full flex-col gap-2">
            <div className="flex flex-1 items-center gap-2">
                <H3 className="line-clamp-1 break-all">{user.username}</H3>
                {(user.role === 'admin' || user.role === 'moderator') && (
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                            <div className="rounded-sm border border-border bg-secondary/20 p-1 text-xs font-bold text-card-foreground backdrop-blur">
                                {user.role === 'admin' && (
                                    <MaterialSymbolsSecurity className="text-[#d0bfff]" />
                                )}
                                {user.role === 'moderator' && (
                                    <MaterialSymbolsShieldPerson className="text-[#ffc9c9]" />
                                )}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <P className="text-sm">
                                {user.role === 'admin'
                                    ? 'Адміністратор'
                                    : 'Модератор'}
                            </P>
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>
            {user.description && (
                <MDViewer className="line-clamp-3 text-sm leading-4 text-muted-foreground md:line-clamp-2">
                    {user.description}
                </MDViewer>
            )}
        </div>
    );
};

export default UserTitle;
