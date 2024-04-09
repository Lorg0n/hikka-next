'use client';

import * as React from 'react';
import { ReactNode } from 'react';

import SearchPlaceholders from '@/components/modals/search-modal/components/ui/search-placeholders';
import {
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

import AnimeCard from './ui/anime-card';
import useAnimeSearchList from './useAnimeSearchList';

interface Props {
    onDismiss: (anime: API.Anime) => void;
    type?: 'link' | 'button';
    children?: ReactNode;
    value?: string;
}

const AnimeSearchList = ({ onDismiss, type, value }: Props) => {
    const { data, isFetching, isRefetching } = useAnimeSearchList({ value });

    return (
        <CommandList className="max-h-none">
            <SearchPlaceholders
                data={data}
                isFetching={isFetching}
                isRefetching={isRefetching}
            />
            {data && data.list.length > 0 && (
                <CommandGroup>
                    {data.list.map((anime) => (
                        <CommandItem key={anime.slug} value={anime.slug}>
                            <AnimeCard
                                onClick={() => onDismiss(anime)}
                                anime={anime}
                                type={type}
                            />
                        </CommandItem>
                    ))}
                </CommandGroup>
            )}
        </CommandList>
    );
};

export default AnimeSearchList;