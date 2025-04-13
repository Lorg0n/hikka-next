import { Metadata, ResolvingMetadata } from 'next';

import getCharacterInfo, {
    Response as CharacterResponse,
} from '@/services/api/characters/getCharacterInfo';

export interface MetadataProps {
    params: {
        slug: string;
    };
}

export default async function generateMetadata(
    { params }: MetadataProps,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const parentMetadata = await parent;
    const slug = params.slug;

    const character: CharacterResponse = await getCharacterInfo({
        params: {
            slug,
        },
    });
    const title = character.name_ua || character.name_en || character.name_ja;

    return {
        title: { default: title, template: title + ' / %s / Hikka' },
        description: undefined,
        openGraph: {
            siteName: parentMetadata.openGraph?.siteName,
            title: { default: title, template: title + ' / %s / Hikka' },
            description: undefined,
            images: character.image,
        },
        twitter: {
            title: { default: title, template: title + ' / %s / Hikka' },
            description: undefined,
            images: character.image,
        },
    };
}
