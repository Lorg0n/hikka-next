'use client';

import { FC, Fragment, memo } from 'react';
import MaterialSymbolsDeleteOutline from '~icons/material-symbols/delete-forever-outline';

import { Button } from '@/components/ui/button';

import useDeleteToken from '@/services/hooks/auth/use-delete-token';
import useSession from '@/services/hooks/auth/use-session';

interface Props {
    authToken: API.AuthToken;
}

const AuthTokenRevokeButton: FC<Props> = ({ authToken }) => {
    const { user: loggedUser } = useSession();
    const { mutate: deleteToken } = useDeleteToken();

    const handleRevokeToken = () => {
        deleteToken({ params: { token_reference: authToken.reference } });
    };

    if (!loggedUser) return null;

    return (
        <Fragment>
            <Button
                className="hidden sm:flex"
                onClick={handleRevokeToken}
                variant="outline"
                size="icon-sm"
            >
                <MaterialSymbolsDeleteOutline className="text-destructive" />
            </Button>
            <Button
                className="flex w-full sm:hidden"
                onClick={handleRevokeToken}
                variant="outline"
                size="icon-sm"
            >
                <MaterialSymbolsDeleteOutline className="text-destructive" />
                Скасувати
            </Button>
        </Fragment>
    );
};

export default memo(AuthTokenRevokeButton);