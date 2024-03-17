'use client';

import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import H3 from '@/components/typography/h3';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import importWatch from '@/services/api/settings/importWatch';
import { useAuthContext } from '@/services/providers/auth-provider';
import { useModalContext } from '@/services/providers/modal-provider';

import Anilist from './components/anilist';
import General from './components/general';


const Component = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [tab, setTab] = useState<'general' | 'aniList'>('general');
    const { closeModal } = useModalContext();
    const queryClient = useQueryClient();
    const { secret } = useAuthContext();
    const [rewrite, setRewrite] = useState(true);
    const [watchList, setWatchList] = useState<Record<string, any>[]>([]);
    const [importing, setImporting] = useState<boolean>(false);

    const handleCompleteImport = async () => {
        setImporting(true);

        if (watchList && watchList.length > 0) {
            try {
                await importWatch({
                    overwrite: rewrite,
                    anime: watchList,
                    secret: String(secret),
                });

                enqueueSnackbar(
                    <span>
                        Ви успішно імпортували{' '}
                        <span className="font-bold">{watchList.length}</span>{' '}
                        аніме до Вашого списку.
                    </span>,
                    { variant: 'success' },
                );

                await queryClient.invalidateQueries();
                closeModal();
            } catch (e) {}
        }

        setImporting(false);
    };

    useEffect(() => {
        setWatchList([]);
    }, [tab]);

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center">
                <H3>Імпорт</H3>
            </div>

            <Tabs
                className="flex w-full flex-col gap-6"
                value={tab}
                onValueChange={(v) => setTab(v as 'general' | 'aniList')}
            >
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="general">Загальний</TabsTrigger>
                    <TabsTrigger value="aniList">AniList</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                    <General
                        watchList={watchList}
                        setWatchList={setWatchList}
                    />
                </TabsContent>
                <TabsContent value="aniList">
                    <Anilist
                        watchList={watchList}
                        setWatchList={setWatchList}
                        importing={importing}
                    />
                </TabsContent>
            </Tabs>

            <div className="flex w-full items-center justify-between space-x-2">
                <Label htmlFor="rewrite">
                    Переписати аніме, які вже додані до списку
                </Label>
                <Switch
                    checked={rewrite}
                    onCheckedChange={(checked) => setRewrite(checked)}
                    id="rewrite"
                />
            </div>

            <div className="w-full">
                <Button
                    variant="default"
                    onClick={handleCompleteImport}
                    disabled={watchList.length === 0}
                    type="submit"
                    className="w-full"
                >
                    {importing && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Імпортувати
                </Button>
            </div>
        </div>
    );
};

export default Component;
