'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { Button } from '@/components/ui/button';

import useRequestTokenReference from '@/services/hooks/auth/use-request-token-reference';
import useSession from '@/services/hooks/auth/use-session';

interface Props {}

const Confirm: FC<Props> = () => {
    const searchParams = useSearchParams();

    const reference = searchParams.get('reference')!;
    const scopes = searchParams.get('scope')?.split(',');

    const { user } = useSession();

    const { mutate, isPending } = useRequestTokenReference();

    const handleConfirm = () => {
        mutate({
            clientReference: reference,
            args: {
                scope: scopes!,
            },
        });
    };

    return (
        <Button
            className="w-full"
            disabled={!user || isPending}
            onClick={handleConfirm}
        >
            {isPending && <span className="loading loading-spinner"></span>}
            Продовжити
        </Button>
    );
};

export default Confirm;
