'use client';

import * as React from 'react';
import {ReactNode, useEffect, useState} from 'react';
import {
    Option as BaseOption,
    OptionOwnerState,
    OptionProps,
    Select as BaseSelect,
    SelectOption,
    SelectProps,
} from '@mui/base';

interface Props extends SelectProps<number | string, any> {
    children: ReactNode;
}

const getOptionColorClasses = ({
    selected,
    highlighted,
    disabled,
}: Partial<OptionOwnerState<number | string>>) => {
    let classes = '';
    if (disabled) {
        classes += 'text-slate-700';
    } else {
        if (selected) {
            classes += ' bg-slate-900 hover:bg-slate-700';
        } else if (highlighted) {
            classes += ' bg-slate-800 text-slate-300 hover:bg-slate-800';
        } else {
            classes += ' hover:bg-slate-800';
        }
    }
    return classes;
};

const Option = React.forwardRef<HTMLLIElement, OptionProps<number | string>>(
    ({ children, ...props }, ref) => {
        return (
            <BaseOption
                ref={ref}
                {...props}
                slotProps={{
                    root: ({ selected, highlighted, disabled }) => ({
                        className: `list-none p-2 flex gap-2 items-center cursor-default last-of-type:border-b-0 ${getOptionColorClasses(
                            { selected, highlighted, disabled },
                        )}`,
                    }),
                }}
            >
                {children}
            </BaseOption>
        );
    },
);

function renderValue(
    option:
        | SelectOption<number | string>
        | SelectOption<number | string>[]
        | null,
    placeholder?: string,
) {
    if (option == null) {
        return (
            <span className="opacity-60">
                {placeholder || `Select an option...`}
            </span>
        );
    }

    if (Array.isArray(option)) {
        if (option.length === 0) {
            return (
                <span className="opacity-60">
                    {placeholder || `Select an option...`}
                </span>
            );
        }

        return (
            <div className="w-full h-full items-center inline-flex gap-2 flex-wrap">
                {option.map((op) => (
                    <span className="badge" key={op.value}>
                        {op.label}
                    </span>
                ))}
            </div>
        );
    }

    return <span>{option.label}</span>;
}

const Select = ({ children, placeholder, multiple, ...props }: Props) => {
    const [open, setOpen] = useState(false);
    const elementRef = React.useRef<HTMLUListElement>(null)

    const close = () => {
        setOpen(false)
    }

    const handleOffClick = (event: any) => {
        if (elementRef.current) {
            if (elementRef.current!.contains(event.target)) {
                return
            }

            close()
        }
    }

    useEffect(() => {
        if (open) {
            document.addEventListener('click', handleOffClick, false)
            document.addEventListener('touchstart', handleOffClick, false)
        }

        return () => {
            document.removeEventListener('click', handleOffClick, false)
            document.removeEventListener('touchstart', handleOffClick, false)
        }
    }, [open])

    return (
            <BaseSelect
                slotProps={{
                    root: ({ focusVisible, open }) => ({
                        className: `relative h-16 overflow-hidden after:absolute after:right-3 after:z-0 text-sm box-border w-full px-3 pr-6 py-2 rounded-lg text-left bg-transparent border border-solid border-neutral transition duration-100 hover:bg-secondary-focus outline-0 shadow shadow-slate-900 ${
                            focusVisible ? 'shadow-outline-purple' : ''
                        } after:top-[calc(50%-10px)] ${
                            open
                                ? 'after:content-["▴"] border-secondary hover:border-secondary'
                                : 'after:content-["▾"] hover:border-white'
                        }`,
                        onClick: () => setOpen((prev) => !prev),
                    }),
                    listbox: {
                        ref: elementRef,
                        className: `text-sm p-1.5 my-3 w-40 rounded-xl overflow-auto outline-0 bg-transparent-black backdrop-blur border border-solid border-slate-700 text-slate-300 shadow shadow-slate-900`,
                        onClick: () => !multiple && close()
                    },
                    popper: { className: `z-[100]`, open },
                }}
                renderValue={(option) => renderValue(option, placeholder)}
                multiple={multiple}
                {...props}
            >
                <div className="rounded-lg overflow-hidden">{children}</div>
            </BaseSelect>
    );
};

Select.Option = Option;

export default Select;