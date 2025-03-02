import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response {
    url: string;
}

export interface Params {
    file: File;
    upload_type: 'avatar' | 'cover' | 'attachment';
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    let data = new FormData();
    data.append('file', params!.file);

    return fetchRequest<Response>({
        ...props,
        path: `/upload/${params?.upload_type}`,
        method: 'put',
        params: data,
        formData: true,
    });
}
