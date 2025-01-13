import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.AuthToken> { }

export default async function req(
    props?: BaseFetchRequestProps,
): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/auth/token/thirdparty`,
        method: 'get',
    });
}
