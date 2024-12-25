'use client';

import { FC, memo, useRef } from 'react';

import ContentCard from '@/components/content-card/content-card';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

interface Props {
    group?: string;
    items: API.CollectionItem<API.MainContent>[];
    content_type: API.ContentType;
}

const CollectionGrid: FC<Props> = ({ group, items, content_type }) => {
    const ref = useRef<HTMLDivElement>(null);

    /* const isVisible = useOnScreen(ref);

    useEffect(() => {
        if (isVisible) {
            console.log('Visible', group);
        }
    }, [isVisible]);
    */

    return (
        <div className="flex flex-col gap-4 scroll-mt-20" id={group} ref={ref}>
            {group && (
                <Header href={`#${group}`}>
                    <HeaderContainer>
                        <HeaderTitle variant="h5">{group}</HeaderTitle>
                    </HeaderContainer>
                </Header>
            )}
            <Stack size={5} extendedSize={5} extended>
                {items.map((item) => (
                    <ContentCard
                        slug={item.content.slug}
                        content_type={content_type}
                        href={`${CONTENT_TYPE_LINKS[content_type]}/${item.content.slug}`}
                        key={item.content.slug}
                        image={item.content.image}
                        title={item.content.title}
                        watch={
                            'watch' in item.content &&
                            item.content.watch.length > 0
                                ? item.content.watch[0]
                                : undefined
                        }
                    />
                ))}
            </Stack>
        </div>
    );
};

export default memo(CollectionGrid);
