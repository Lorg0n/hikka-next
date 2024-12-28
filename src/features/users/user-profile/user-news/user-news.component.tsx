'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';

import useArticles from '@/services/hooks/articles/use-articles';

import NewsItem from './news-item';

interface Props {}

const UserNews: FC<Props> = () => {
    const params = useParams();
    const { list } = useArticles({
        category: 'news',
        author: String(params.username),
    });

    if (!list || list.length === 0) return null;

    const filteredNews = list?.slice(0, 3);

    return (
        <Block>
            <Header href={`/news?author=${params.username}`}>
                <HeaderContainer>
                    <HeaderTitle>Новини</HeaderTitle>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {filteredNews?.map((article) => (
                    <NewsItem key={article.slug} article={article} />
                ))}
            </div>
        </Block>
    );
};

export default UserNews;
