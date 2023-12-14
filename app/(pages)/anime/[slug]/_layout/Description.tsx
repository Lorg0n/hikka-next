'use client';

import Markdown from 'react-markdown';

import { useParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';

const Component = () => {
    const params = useParams();
    const { data } = useQuery({
        queryKey: ['anime', params.slug],
        queryFn: () => getAnimeInfo({ slug: String(params.slug) }),
    });

    if (!data || !data.synopsis_ua || !data.synopsis_en) {
        return null;
    }

    return (
        <div className="flex flex-col gap-8">
            <h3>Опис</h3>
            <Markdown className="markdown">
                {data.synopsis_ua || data.synopsis_en}
            </Markdown>
        </div>
    );
};

export default Component;
