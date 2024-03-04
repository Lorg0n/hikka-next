'use client';

import { useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Input } from '@/components/ui/input';
import createQueryString from '@/utils/createQueryString';


const Component = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()!;

    const [search, setSearch] = useState(searchParams.get('search'));

    const handleChangeSearch = (value: string) => {
        const query = createQueryString(
            'search',
            value,
            new URLSearchParams(searchParams),
        );
        setSearch(value);

        router.replace(`${pathname}?${query}`);
    };

    return (
        <div className="flex flex-col gap-4 flex-1">
            <Input
                value={search || ''}
                onChange={(event) => handleChangeSearch(event.target.value)}
                type="text"
                placeholder="Введіть назву аніме..."
            />
        </div>
    );
};

export default Component;