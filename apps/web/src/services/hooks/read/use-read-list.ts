import { QueryKey } from '@tanstack/react-query';

import { convertTitle } from '../../../utils/adapters/convert-title';
import getQueryClient from '../../../utils/get-query-client';
import getReadList, { Params } from '../../api/read/getReadList';
import { useSettingsContext } from '../../providers/settings-provider';
import useInfiniteList from '../use-infinite-list';

export const paramsBuilder = ({ username, ...props }: Params): Params => ({
    username,
    read_status: props.read_status || 'watching',
    media_type: props.media_type || [],
    status: props.status || [],
    genres: props.genres || [],
    magazines: props.magazines || [],
    sort: props.sort || ['read_score:desc'],
    years: props.years || [],
    content_type: props.content_type || 'manga',
});

export const key = (params: Params): QueryKey => ['read-list', params];

const useReadList = ({ username, read_status, ...props }: Params) => {
    const { titleLanguage } = useSettingsContext();

    const params = paramsBuilder({
        read_status,
        username,
        ...props,
    });

    return useInfiniteList({
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getReadList({
                params,
                page: pageParam,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: a.list.map((b) => ({
                    ...b,
                    content: convertTitle({
                        data: b.content,
                        titleLanguage: titleLanguage!,
                    }),
                })),
            })),
        }),
    });
};

export const prefetchReadList = (props: Params) => {
    const queryClient = getQueryClient();

    const params = paramsBuilder(props);

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getReadList({
                params,
                page: pageParam,
            }),
    });
};

export default useReadList;
