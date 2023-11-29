'use client';

import { PropsWithChildren, useEffect, useState, Children } from 'react';
import { createPortal } from 'react-dom';
import IconamoonSignDivisionSlashThin from '~icons/iconamoon/sign-division-slash-thin';
import clsx from "clsx";
import useIsMobile from "@/utils/hooks/useIsMobile";

interface Props extends PropsWithChildren {}

const Component = ({ children }: Props) => {
    const isMobile = useIsMobile();
    const arrayChildren = Children.toArray(children);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    });

    if (!mounted || arrayChildren.length === 0) {
        return null;
    }

    if (isMobile) {
        return createPortal(
            <div className="min-h-[2.5rem] px-4 h-auto flex-1 gap-4 items-center overflow-hidden flex md:hidden">{Children.map(arrayChildren, (child, index) => {
                return (
                    <>
                        <IconamoonSignDivisionSlashThin className={clsx("opacity-30", index === 0 && "hidden md:block")} />
                        {child}
                    </>
                )
            })}</div>,
            document.getElementById('nav-items-mobile')!,
        );
    }

    return createPortal(
        <>{Children.map(arrayChildren, (child, index) => {
            return (
                <>
                    <IconamoonSignDivisionSlashThin className={clsx("opacity-30", index === 0 && "hidden md:block")} />
                    {child}
                </>
            )
        })}</>,
        document.getElementById('nav-items')!,
    );
};

export default Component;
