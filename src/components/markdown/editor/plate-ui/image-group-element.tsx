'use client';

import { cn, withRef } from '@udecode/cn';
import { TElement, isText } from '@udecode/plate-common';
import { PlateEditor } from '@udecode/plate-common/react';

import ImageGroupAddImage from './image-group-add-image';
import { PlateElement } from './plate-element';

interface AddImageButtonProps {
    element: TElement;
    editor: PlateEditor;
}

export const ImageGroupElement = withRef<typeof PlateElement>(
    ({ children, className, element, editor, ...props }, ref) => {
        const isOnlyText =
            element.children.length === 1 &&
            isText(element.children[0]) &&
            element.children[0].text === '';

        return (
            <PlateElement
                ref={ref}
                as="div"
                className={cn('mb-4 flex gap-3 overflow-x-auto', className)}
                element={element}
                editor={editor}
                {...props}
                contentEditable={false}
            >
                {!isOnlyText && children}
                {children.length < 4 && (
                    <ImageGroupAddImage editor={editor} element={element} />
                )}
            </PlateElement>
        );
    },
);
