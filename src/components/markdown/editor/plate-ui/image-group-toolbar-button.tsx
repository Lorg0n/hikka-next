'use client';

import { useEditorRef } from '@udecode/plate-common/react';
import { ImageIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';

import ImageGroupAddImage from './image-group-add-image';
import { ToolbarButton } from './toolbar';

export function ImageGroupToolbarButton() {
    const editor = useEditorRef();

    return (
        <ToolbarButton tooltip="Зображення" className="relative">
            <ImageGroupAddImage editor={editor}>
                <Input
                    type="file"
                    id="image-group-input"
                    max={1}
                    className="absolute left-0 top-0 size-full cursor-pointer opacity-0"
                    accept="image/*"
                />
            </ImageGroupAddImage>
            <ImageIcon className="size-4" />
        </ToolbarButton>
    );
}
