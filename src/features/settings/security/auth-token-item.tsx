'use client';

import { format, formatDistanceToNow, fromUnixTime } from 'date-fns';
import { FC, useMemo } from 'react';
import MaterialSymbolsClock from '~icons/material-symbols/nest-clock-farsight-analog-outline-rounded';

import H5 from '@/components/typography/h5';
import P from '@/components/typography/p';
import Card from '@/components/ui/card';
import Scope from '@/features/oauth/client/scope';
import { SCOPES, SCOPE_GROUPS } from '@/utils/constants/oauth';

import AuthTokenRevokeButton from './auth-token-revoke-button.component';

interface Props {
    authToken: API.AuthToken;
}

const capitalize = (str: string): string =>
    str ? str[0].toUpperCase() + str.slice(1) : str;

const useAuthTokenDuration = (expiration: number): string => {
    const expirationTime = fromUnixTime(expiration);
    const timeLeft = expirationTime.getTime() / 1000 - Date.now() / 1000;

    return timeLeft <= 0
        ? 'Закінчився'
        : capitalize(formatDistanceToNow(expirationTime, { includeSeconds: true }));
};

const useScopes = (scope: string[]): Hikka.Scope[] => {
    return useMemo(
        () =>
            scope
                .map(
                    (s) =>
                        SCOPE_GROUPS.find((sg) => sg.slug === s)?.scopes ||
                        SCOPES.find((sg) => sg.slug === s),
                )
                .flat()
                .filter((s) => s) as Hikka.Scope[],
        [scope],
    );
};

const AuthTokenItem: FC<Props> = ({ authToken }) => {
    const duration = useAuthTokenDuration(authToken.expiration);
    const scopes = useScopes(authToken.scope);

    return (
        <Card className="flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MaterialSymbolsClock />
                        <H5 className="line-clamp-1">{duration}</H5>
                    </div>
                    <P className="text-xs text-muted-foreground">
                        {format(new Date(authToken.created * 1000), 'd MMMM HH:mm')} -{' '}
                        {format(new Date(authToken.expiration * 1000), 'd MMMM HH:mm')}
                    </P>
                </div>

                <div className="flex flex-col gap-1">
                    <P className="text-sm">{authToken.client.name}</P>
                    <P className="text-sm text-muted-foreground line-clamp-3">
                        {authToken.client.description}
                    </P>
                </div>

                {scopes.length > 0 && (
                    <div className="-m-4 flex flex-col gap-1 p-4">
                        {scopes.map((s) => (
                            <Scope key={s.slug} scope={s} />
                        ))}
                    </div>
                )}
            </div>

            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex flex-1 flex-col">
                    <P className="text-xs text-muted-foreground opacity-60">
                        Використано{' '}
                        {format(new Date(authToken.used * 1000), 'dd MMMM HH:mm')}
                    </P>
                </div>
                <AuthTokenRevokeButton authToken={authToken} />
            </div>
        </Card>
    );
};

export default AuthTokenItem;