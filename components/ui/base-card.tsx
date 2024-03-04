import {
    ForwardedRef,
    MouseEventHandler,
    ReactNode,
    Ref,
    forwardRef,
    memo,
} from 'react';
import { UrlObject } from 'url';

import Link from 'next/link';

import Image from '@/components/ui/image';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils';

export interface Props {
    target?: string;
    title?: string;
    description?: string;
    leftSubtitle?: string;
    rightSubtitle?: string;
    poster?: string | ReactNode;
    href?: string | UrlObject;
    posterClassName?: string;
    containerClassName?: string;
    className?: string;
    onMouseOver?: MouseEventHandler<HTMLAnchorElement>;
    onMouseOut?: MouseEventHandler<HTMLAnchorElement>;
    children?: ReactNode;
    onClick?: MouseEventHandler<HTMLDivElement>;
}

const Component = forwardRef(
    (
        {
            poster,
            title,
            description,
            leftSubtitle,
            rightSubtitle,
            posterClassName,
            containerClassName,
            className,
            children,
            href,
            onClick,
            ...props
        }: Props,
        ref: ForwardedRef<HTMLAnchorElement>,
    ) => {
        const content = (
            <>
                <div
                    className={cn(
                        'relative w-full overflow-hidden rounded-lg bg-muted pt-[140%]',
                        containerClassName,
                    )}
                >
                    <div className="absolute left-0 top-0 h-full w-full flex place-items-center bg-secondary/60">
                        {poster &&
                            (typeof poster === 'string' ? (
                                <figure className="relative h-full w-full flex place-items-center">
                                    <Image
                                        src={poster}
                                        width={184}
                                        height={259}
                                        className={cn(
                                            'h-full w-full object-cover',
                                            posterClassName,
                                        )}
                                        alt="Poster"
                                    />
                                </figure>
                            ) : (
                                poster
                            ))}
                    </div>
                    {children}
                </div>
                {(title || description) && (
                    <div className="mt-1 truncate">
                        {description && (
                            <p className="text-xs text-muted-foreground mb-1">
                                {description}
                            </p>
                        )}
                        {title && <Label className="leading-5">{title}</Label>}
                        {(leftSubtitle || rightSubtitle) && (
                            <div className="flex gap-2 mt-1 items-center">
                                {leftSubtitle && (
                                    <Label className="text-xs text-muted-foreground">
                                        {leftSubtitle}
                                    </Label>
                                )}
                                {leftSubtitle && rightSubtitle && (
                                    <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                                )}
                                {rightSubtitle && (
                                    <Label className="text-xs text-muted-foreground">
                                        {rightSubtitle}
                                    </Label>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </>
        );

        if (!href) {
            return (
                <div
                    onClick={onClick}
                    ref={ref as Ref<HTMLDivElement>}
                    className={cn(
                        'relative group flex w-full flex-col gap-2',
                        onClick && 'cursor-pointer',
                        className,
                    )}
                >
                    {content}
                </div>
            );
        }

        return (
            <Link
                href={href}
                className={cn("relative group flex w-full flex-col gap-2", className)}
                scroll
                {...props}
                ref={ref}
            >
                {content}
            </Link>
        );
    },
);

export default memo(Component);