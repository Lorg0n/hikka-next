import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';

import deleteToken from '@/services/api/auth/deleteToken';
import { useModalContext } from '@/services/providers/modal-provider';

const useDeleteClient = () => {
    const { closeModal } = useModalContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['delete-token'],
        mutationFn: deleteToken,
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['thirdparty-tokens'],
                exact: false,
            });
            closeModal();
        },
        onSuccess: () => {
            enqueueSnackbar('Ви успішно видалили токен авторизації.', {
                variant: 'success',
            });
        },
    });
};

export default useDeleteClient;
