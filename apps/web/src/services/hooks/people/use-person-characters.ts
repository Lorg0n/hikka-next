import { convertTitle } from '@/utils/adapters/convert-title';
import getQueryClient from '@/utils/get-query-client';
import getPersonCharacters, {
    Params,
} from '../../api/people/getPersonCharacters';
import { useSettingsContext } from '../../providers/settings-provider';
import useInfiniteList from '../use-infinite-list';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug,
});

export const key = (params: Params) => ['person-characters', params.slug];

const usePersonCharacters = (props: Params, options?: Hikka.QueryOptions) => {
    const { titleLanguage } = useSettingsContext();
    const params = paramsBuilder(props);

    return useInfiniteList({
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getPersonCharacters({
                params,
                page: pageParam,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: a.list.map((ch) => ({
                    ...ch,
                    anime: convertTitle<API.AnimeInfo>({
                        data: ch.anime,
                        titleLanguage: titleLanguage!,
                    }),
                })),
            })),
        }),
        ...options,
    });
};

export const prefetchPersonCharacters = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getPersonCharacters({
                params,
                page: pageParam,
            }),
    });
};

export default usePersonCharacters;
