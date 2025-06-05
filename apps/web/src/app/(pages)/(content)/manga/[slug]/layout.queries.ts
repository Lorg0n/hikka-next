import { ContentTypeEnum } from '@hikka/client';
import { QueryClient } from '@hikka/react/core';
import {
    prefetchFavouriteStatus,
    prefetchFranchise,
    prefetchMangaCharacters,
    prefetchReadingUsers,
} from '@hikka/react/server';

import getHikkaClientConfig from '@/utils/get-hikka-client-config';

interface Props {
    params: {
        slug: string;
    };
    queryClient: QueryClient;
}

const prefetchQueries = async ({ params: { slug }, queryClient }: Props) => {
    const clientConfig = await getHikkaClientConfig();

    await Promise.all([
        prefetchMangaCharacters({ slug, clientConfig, queryClient }),
        prefetchFranchise({
            slug,
            contentType: ContentTypeEnum.MANGA,
            clientConfig,
        }),
        clientConfig.authToken
            ? prefetchReadingUsers({
                  slug,
                  contentType: ContentTypeEnum.MANGA,
                  clientConfig,
                  queryClient,
              })
            : undefined,
        clientConfig.authToken
            ? prefetchFavouriteStatus({
                  slug,
                  contentType: ContentTypeEnum.MANGA,
                  clientConfig,
                  queryClient,
              })
            : undefined,
    ]);
};

export default prefetchQueries;
