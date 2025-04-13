import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response extends API.WithPagination<API.Anime> {}

export interface Params {
    slug: string;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/anime/${params?.slug}/franchise`,
        method: 'get',
        config: {
            next: {
                revalidate: 60,
            },
        },
    });
}
