import { useMutation, useQueryClient } from '@tanstack/react-query';

import unfollow, { Params } from '@/services/api/follow/unfollow';

const useUnfollow = ({ username }: Params) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['unfollow', username],
        mutationFn: () =>
            unfollow({
                params: { username: String(username) },
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });
};

export default useUnfollow;
