'use client';

import { cn, withRef } from '@udecode/cn';
import { Children, useCallback } from 'react';

import { PlateElement } from './plate-element';

export const ImageGroupViewElement = withRef<typeof PlateElement>(
    ({ children, className, ...props }, ref) => {
        const renderMediaContent = useCallback(() => {
            const mappedChildren = Children.toArray(children);

            switch (children.length) {
                case 2:
                    return (
                        <div className="grid size-full grid-cols-2 gap-1">
                            {mappedChildren[0]}
                            {mappedChildren[1]}
                        </div>
                    );
                case 3:
                    return (
                        <div className="grid size-full grid-cols-2 gap-1">
                            {mappedChildren[0]}
                            <div className="grid grid-rows-2 gap-1">
                                {mappedChildren[1]}
                                {mappedChildren[2]}
                            </div>
                        </div>
                    );
                case 4:
                    return (
                        <div className="grid size-full grid-cols-2 gap-1">
                            <div className="grid grid-rows-2 gap-1">
                                {mappedChildren[0]}
                                {mappedChildren[1]}
                            </div>
                            <div className="grid grid-rows-2 gap-1">
                                {mappedChildren[2]}
                                {mappedChildren[3]}
                            </div>
                        </div>
                    );
                default:
                    return (
                        <div className="grid size-full grid-cols-1 gap-1">
                            {mappedChildren[0]}
                        </div>
                    );
            }
        }, [children]);

        return (
            <PlateElement
                contentEditable={false}
                ref={ref}
                as="div"
                className={cn(
                    'mb-4 h-[350px] overflow-hidden rounded-md border border-border',
                    className,
                )}
                {...props}
            >
                {renderMediaContent()}
            </PlateElement>
        );
    },
);
