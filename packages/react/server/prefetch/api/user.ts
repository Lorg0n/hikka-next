import { ActivityResponse, UserResponse } from '@hikka/client';

import { queryKeys } from '@/core';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';
import {
    UseSessionParams,
    UseUserActivityParams,
    UseUserByUsernameParams,
    UseUserSearchParams,
} from '@/types/user';

/**
 * Prefetches user search results for server-side rendering
 */
export async function prefetchSearchUsers({
    args,
    ...rest
}: PrefetchQueryParams<UserResponse[]> & UseUserSearchParams) {
    return prefetchQuery({
        queryKey: queryKeys.user.search(args),
        queryFn: (client) => client.user.searchUsers(args),
        ...rest,
    });
}

/**
 * Prefetches the current user's profile for server-side rendering
 */
export async function prefetchSession({
    ...rest
}: PrefetchQueryParams<UserResponse> & UseSessionParams = {}) {
    return prefetchQuery({
        queryKey: queryKeys.user.me(),
        queryFn: (client) => client.user.getCurrentUser(),
        ...rest,
    });
}

/**
 * Prefetches a user's activity for server-side rendering
 */
export async function prefetchUserActivity({
    username,
    ...rest
}: PrefetchQueryParams<ActivityResponse[]> & UseUserActivityParams) {
    return prefetchQuery({
        queryKey: queryKeys.user.activity(username),
        queryFn: (client) => client.user.getUserActivity(username),
        ...rest,
    });
}

/**
 * Prefetches a user profile by username for server-side rendering
 */
export async function prefetchUserByUsername({
    username,
    ...rest
}: PrefetchQueryParams<UserResponse> &
    Pick<UseUserByUsernameParams, 'username'>) {
    return prefetchQuery({
        queryKey: queryKeys.user.byUsername(username),
        queryFn: (client) => client.user.getUserByUsername(username),
        ...rest,
    });
}
