import config from '@/utils/api/config';

interface Response {
    secret: string;
    expiration: number;
    created: number;
}

export default async function req(params: {
    password: string;
    token: string;
}): Promise<Response> {
    const res = await fetch(config.baseAPI + '/auth/password/confirm', {
        method: 'post',
        body: JSON.stringify(params),
        ...config.config,
    });

    if (!res.ok) {
        if (res.status >= 400 && res.status <= 499) {
            throw await res.json();
        }
        throw new Error('Failed to fetch data');
    }

    return await res.json();
}