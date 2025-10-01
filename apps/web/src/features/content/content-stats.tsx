'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { CONTENT_CONFIG } from '@/utils/constants/common';

import NativeScore from './components/content-stats/native-score';
import Readlist from './components/content-stats/readlist';
import Score from './components/content-stats/score';
import Watchlist from './components/content-stats/watchlist';

interface Props {
    content_type:
    | ContentTypeEnum.ANIME
    | ContentTypeEnum.MANGA
    | ContentTypeEnum.NOVEL;
}

const ContentStats = ({ content_type }: Props) => {
    const [source, setSource] = useState<'native' | 'mal'>('mal');
    const params = useParams();

    const { data } = CONTENT_CONFIG[content_type].useInfo(String(params.slug));

    const hasNativeData = !!(data && data.native_score && data.native_scored_by);

    const listTabValue =
        content_type === ContentTypeEnum.ANIME ? 'watchlist' : 'readlist';

    useEffect(() => {
        if (!hasNativeData && source === 'native') {
            setSource('mal');
        }
    }, [hasNativeData, source]);


    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle>Статистика</HeaderTitle>
                    <ToggleGroup
                        type="single"
                        value={source}
                        onValueChange={(value: 'native' | 'mal') => {
                            if (value) setSource(value);
                        }}
                        size="badge"
                    >
                        <ToggleGroupItem value="mal" aria-label="MAL">
                            MAL
                        </ToggleGroupItem>
                        {hasNativeData && (
                            <ToggleGroupItem value="native" aria-label="Native">
                                Локальна
                            </ToggleGroupItem>
                        )}
                    </ToggleGroup>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>

            {source === 'native' && hasNativeData && (
                <NativeScore data={data} />
            )}

            {source === 'mal' && (
                <Tabs defaultValue={listTabValue}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value={listTabValue}>
                            У списках
                        </TabsTrigger>
                        <TabsTrigger value="score">Оцінки</TabsTrigger>
                    </TabsList>

                    {content_type !== ContentTypeEnum.ANIME && (
                        <TabsContent value="readlist">
                            <Readlist
                                content_type={
                                    content_type as
                                    | ContentTypeEnum.MANGA
                                    | ContentTypeEnum.NOVEL
                                }
                            />
                        </TabsContent>
                    )}
                    {content_type === ContentTypeEnum.ANIME && (
                        <TabsContent value="watchlist">
                            <Watchlist />
                        </TabsContent>
                    )}

                    <TabsContent value="score">
                        <Score content_type={content_type} />
                    </TabsContent>
                </Tabs>
            )}
        </Block>
    );
};

export default ContentStats;