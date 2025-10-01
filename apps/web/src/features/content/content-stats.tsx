'use client';

import { ContentTypeEnum } from '@hikka/client';

import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useState } from 'react';

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

    const listTabValue =
        content_type === ContentTypeEnum.ANIME ? 'watchlist' : 'readlist';

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
                        <ToggleGroupItem value="native" aria-label="Native">
                            Власна
                        </ToggleGroupItem>
                        <ToggleGroupItem value="mal" aria-label="MAL">
                            MAL
                        </ToggleGroupItem>
                    </ToggleGroup>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>

            {/* Render Hikka's simple score display */}
            {source === 'native' && (
                <NativeScore content_type={content_type} />
            )}

            {/* Render MAL's detailed stats with tabs */}
            {source === 'mal' && (
                <Tabs defaultValue={listTabValue}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value={listTabValue}>
                            У списках
                        </TabsTrigger>
                        <TabsTrigger value="score">Оцінки</TabsTrigger>
                    </TabsList>

                    {/* Content for MAL "In Lists" tab */}
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

                    {/* Content for MAL "Scores" tab */}
                    <TabsContent value="score">
                        <Score content_type={content_type} />
                    </TabsContent>
                </Tabs>
            )}
        </Block>
    );
};

export default ContentStats;