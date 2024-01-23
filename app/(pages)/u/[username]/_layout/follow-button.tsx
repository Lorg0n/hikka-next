'use client';

import CilUserFollow from '~icons/cil/user-follow';
import CilUserUnfollow from '~icons/cil/user-unfollow';

import { useParams } from 'next/navigation';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/app/_components/ui/button';
import checkFollow from '@/utils/api/follow/checkFollow';
import follow from '@/utils/api/follow/follow';
import unfollow from '@/utils/api/follow/unfollow';
import getUserInfo from '@/utils/api/user/getUserInfo';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { useModalContext } from '@/utils/providers/modal-provider';

interface Props {}

const Component = ({}: Props) => {
    const { switchModal } = useModalContext();
    const queryClient = useQueryClient();
    const params = useParams();
    const { secret } = useAuthContext();

    const loggedUser: Hikka.User | undefined = queryClient.getQueryData([
        'loggedUser',
        secret,
    ]);

    const { data: user } = useQuery({
        queryKey: ['user', params.username],
        queryFn: () => getUserInfo({ username: String(params.username) }),
        staleTime: 0,
    });

    const { data: followChecker } = useQuery({
        queryKey: ['followChecker', secret, params.username],
        queryFn: () =>
            checkFollow({
                secret: String(secret),
                username: String(params.username),
            }),
        enabled: loggedUser && loggedUser.username !== params.username,
    });

    const { mutate: mutateFollow, isPending: followLoading } = useMutation({
        mutationKey: ['follow', secret, params.username],
        mutationFn: () =>
            follow({
                secret: String(secret),
                username: String(params.username),
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });

    const { mutate: mutateUnfollow, isPending: unfollowLoading } = useMutation({
        mutationKey: ['unfollow', secret, params.username],
        mutationFn: () =>
            unfollow({
                secret: String(secret),
                username: String(params.username),
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });

    const handleFollowAction = async (action: 'follow' | 'unfollow') => {
        switch (action) {
            case 'follow':
                mutateFollow();
                break;
            case 'unfollow':
                mutateUnfollow();
        }
    };

    if (!user || !loggedUser) {
        return null;
    }

    return loggedUser ? (
        loggedUser.username !== user.username && followChecker ? (
            followChecker.follow ? (
                <Button
                    disabled={unfollowLoading}
                    onClick={() => handleFollowAction('unfollow')}
                    variant="outline"
                    className="w-full"
                >
                    {unfollowLoading ? (
                        <span className="loading loading-spinner"></span>
                    ) : (
                        <CilUserUnfollow />
                    )}
                    Не стежити
                </Button>
            ) : (
                <Button
                    variant="secondary"
                    disabled={followLoading}
                    onClick={() => handleFollowAction('follow')}
                    className="btn w-full"
                >
                    {followLoading ? (
                        <span className="loading loading-spinner"></span>
                    ) : (
                        <CilUserFollow />
                    )}
                    Відстежувати
                </Button>
            )
        ) : null
    ) : (
        <Button
            onClick={() => switchModal('login')}
            className="w-full"
        >
            <CilUserFollow />
            Відстежувати
        </Button>
    );
};

export default Component;