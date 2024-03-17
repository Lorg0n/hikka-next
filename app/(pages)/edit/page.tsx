import * as React from 'react';
import AntDesignFilterFilled from '~icons/ant-design/filter-filled';

import { redirect } from 'next/navigation';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import EditFiltersModal from '@/components/modals/edit-filters-modal';
import { Button } from '@/components/ui/button';
import getEditList from '@/services/api/edit/getEditList';
import getQueryClient from '@/utils/getQueryClient';

import Filters from '../../../components/filters/edit-filters';
import EditList from './_components/edit-list/edit-list';


const Component = async ({
    searchParams: { page },
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) => {
    if (!page) {
        return redirect('/edit?page=1');
    }

    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['editList', page],
        queryFn: () => getEditList({ page: Number(page) }),
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="grid grid-cols-1 justify-center gap-8 lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-16">
                <EditFiltersModal>
                    <Button variant="outline" className="flex lg:hidden">
                        <AntDesignFilterFilled /> Фільтри
                    </Button>
                </EditFiltersModal>
                <EditList page={page as string} />
                <div className="sticky top-20 order-1 hidden w-full rounded-md border border-secondary/60 bg-secondary/30 opacity-60 transition-opacity hover:opacity-100 lg:order-2 lg:block">
                    <Filters className="px-4" />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default Component;
