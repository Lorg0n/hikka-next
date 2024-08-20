import { useQuery } from '@tanstack/react-query';

import { Params } from '@/services/api/anime/getAnimeInfo';
import getNovelInfo from '@/services/api/novel/getNovelInfo';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertTitle } from '@/utils/adapters/convert-title';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug,
});

export const key = (params: Params) => ['novel', params.slug];

const useNovelInfo = (props: Params, options?: Hikka.QueryOptions) => {
    const { titleLanguage } = useSettingsContext();
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () =>
            getNovelInfo({
                params,
            }),
        ...options,
        select: (data) =>
            convertTitle<API.NovelInfo>({
                titleLanguage: titleLanguage!,
                data: data,
            }),
        refetchOnWindowFocus: false,
    });
};

export const prefetchNovelInfo = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () =>
            getNovelInfo({
                params,
            }),
    });
};

export default useNovelInfo;
