import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response
    extends Hikka.WithPagination<{
        reference: string;
        created: number;
        anime: Hikka.Anime;
    }> {}

export default async function req({
    username,
    page = 1,
    size = 15,
    secret,
}: {
    username: string;
    page?: number;
    size?: number;
    secret?: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/favourite/anime/${username}/list`,
        method: 'get',
        secret,
        page,
        size,
    });
}