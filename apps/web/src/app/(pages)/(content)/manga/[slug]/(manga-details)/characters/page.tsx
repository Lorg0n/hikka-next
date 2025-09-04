import { ContentTypeEnum } from '@hikka/client';
import { Metadata, ResolvingMetadata } from 'next';

import { ContentCharacters as Characters } from '@/features/content';

import _generateMetadata from '@/utils/generate-metadata';

export async function generateMetadata(
    props: { params: Promise<{ slug: string }> },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const params = await props.params;
    const parentMetadata = await parent;

    return _generateMetadata({
        title: 'Персонажі',
        description: parentMetadata.openGraph?.description,
        images: parentMetadata.openGraph?.images,
    });
}

const MangaCharactersPage = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Characters extended content_type={ContentTypeEnum.MANGA} />
        </div>
    );
};

export default MangaCharactersPage;
