'use client';

import MaterialSymbolsMoreHoriz from '@/components/icons/material-symbols/MaterialSymbolsMoreHoriz';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel';

import EditTopStatsModal from '@/features/modals/edit-top-stats-modal/edit-top-stats-modal.component';

import useEditTop from '@/services/hooks/stats/edit/use-edit-top';
import { useModalContext } from '@/services/providers/modal-provider';

import EditTopItem from './edit-top-item';

function EditTopStats() {
    const { openModal } = useModalContext();
    const { list } = useEditTop();

    if (!list || list.length === 0) {
        return null;
    }

    const handleOpenModal = () => {
        openModal({
            content: <EditTopStatsModal />,
            title: 'Топ авторів',
            type: 'sheet',
        });
    };

    return (
        <Carousel
            opts={{
                breakpoints: {
                    '(min-width: 1024px)': {
                        active: false,
                    },
                },
            }}
            className="-mx-4 lg:mx-0"
        >
            <CarouselContent containerClassName="lg:overflow-visible px-4 lg:px-0">
                {list.slice(0, 4).map((stat, index) => (
                    <CarouselItem
                        className="basis-2/3 md:basis-1/3 lg:basis-1/5"
                        key={stat.user.reference}
                    >
                        <EditTopItem
                            rank={index + 1}
                            user={stat.user}
                            accepted={stat.accepted}
                            closed={stat.closed}
                            denied={stat.denied}
                        />
                    </CarouselItem>
                ))}
                <CarouselItem className="md:basis-1/3 lg:basis-1/5">
                    <button
                        onClick={handleOpenModal}
                        className="flex w-full items-center justify-center rounded-md border border-secondary/60 bg-secondary/30 p-4 opacity-60 transition-opacity hover:opacity-100"
                    >
                        <MaterialSymbolsMoreHoriz className="text-4xl text-muted-foreground" />
                    </button>
                </CarouselItem>
            </CarouselContent>
        </Carousel>
    );
}

export default EditTopStats;
