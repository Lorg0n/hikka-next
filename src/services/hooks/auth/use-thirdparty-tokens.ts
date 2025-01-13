import { QueryKey, useQuery } from '@tanstack/react-query';

import getThirdpartyTokens from '@/services/api/auth/getThirdpartyTokens';
import getQueryClient from '@/utils/get-query-client';

export const key = (): QueryKey => ['thirdparty-tokens'];

const useThirdpartyTokens = (options?: Hikka.QueryOptions) => {
    return useQuery({
        queryKey: key(),
        queryFn: () => getThirdpartyTokens(),
        ...options,
        refetchOnWindowFocus: false,
    });
};

export const prefetchThirdpartyTokens = () => {
    const queryClient = getQueryClient();

    return queryClient.prefetchQuery({
        queryKey: key(),
        queryFn: () => getThirdpartyTokens(),
    });
};

export default useThirdpartyTokens;
