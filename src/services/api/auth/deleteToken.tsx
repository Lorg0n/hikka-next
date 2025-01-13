import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.AuthToken { }

export interface Params {
    token_reference: string;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/auth/token/${params?.token_reference}`,
        method: 'delete',
    });
}
