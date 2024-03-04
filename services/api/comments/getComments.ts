import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    list: API.Comment[];
    pagination: API.Pagination;
}

export default async function req({
    slug,
    content_type,
    secret,
    page = 1,
    size = 15,
}: {
    slug: string;
    content_type: API.ContentType;
    page?: number;
    secret?: string;
    size?: number;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/comments/${content_type}/${slug}/list`,
        method: 'get',
        secret,
        page,
        size,
    });
}