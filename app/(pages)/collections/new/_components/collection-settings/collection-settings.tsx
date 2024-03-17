'use client';

import React from 'react';
import SimpleIconsAnilist from '~icons/simple-icons/anilist';

import { useParams } from 'next/navigation';

import AnilistCollection from '@/app/(pages)/collections/new/_components/anilist-collection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputTags } from '@/components/ui/input-tags';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import useCreateCollection from '@/services/hooks/collections/useCreateCollection';
import useUpdateCollection from '@/services/hooks/collections/useUpdateCollection';
import { useAuthContext } from '@/services/providers/auth-provider';
import {
    State as CollectionState,
    useCollectionContext,
} from '@/services/providers/collection-provider';
import { useModalContext } from '@/services/providers/modal-provider';

import GroupInputs from './_components/group-inputs';

interface Props {
    mode?: 'create' | 'edit';
}

const Component = ({ mode = 'create' }: Props) => {
    const { openModal } = useModalContext();
    const params = useParams();
    const {
        groups,
        title,
        nsfw,
        spoiler,
        private: isPrivate,
        setState: setCollectionState,
        description,
        tags,
        stateToCreate,
    } = useCollectionContext();

    const { secret } = useAuthContext();

    const { mutate: mutateCreateCollection, isPending: isCreatePending } =
        useCreateCollection({
            ...stateToCreate!(),
            secret: String(secret),
        });

    const { mutate: mutateUpdateCollection, isPending: isUpdatePending } =
        useUpdateCollection({
            ...stateToCreate!(),
            secret: String(secret),
            reference: String(params.reference),
        });

    const handleParamChange = (
        param: keyof CollectionState,
        value: string | boolean,
    ) => {
        setCollectionState!((state) => {
            return {
                ...state,
                [param]: value,
            };
        });
    };

    const handleAddNewGroup = () => {
        if (groups.length === 1 && !groups[0].isGroup) {
            setCollectionState!((state) => {
                return {
                    ...state,
                    groups: [
                        {
                            ...state.groups[0],
                            title: '',
                            isGroup: true,
                        },
                    ],
                };
            });
            return;
        }

        setCollectionState!((state) => {
            return {
                ...state,
                groups: [
                    ...state.groups,
                    {
                        id: String(Date.now()),
                        title: '',
                        isGroup: true,
                        items: [],
                    },
                ],
            };
        });
    };

    return (
        <ScrollArea className="flex flex-col items-start gap-8 lg:max-h-[calc(100vh-6rem)]">
            <div className="flex h-full flex-col gap-6 p-4">
                <div className="flex flex-col gap-4">
                    <Label className="text-muted-foreground">
                        Назва колекції
                    </Label>
                    <Input
                        placeholder="Введіть назву"
                        value={title || ''}
                        onChange={(e) =>
                            handleParamChange('title', e.target.value)
                        }
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <Label className="text-muted-foreground">Групи</Label>
                    {groups.length > 0 &&
                        groups.some((group) => group.isGroup) && (
                            <GroupInputs />
                        )}
                    <Button variant="secondary" onClick={handleAddNewGroup}>
                        Додати групу
                    </Button>
                </div>

                <div className="flex flex-col gap-4">
                    <Label htmlFor="tags" className="text-muted-foreground">
                        Теги
                    </Label>
                    <InputTags
                        disabled={tags.length === 3}
                        id="tags"
                        value={tags}
                        onChange={(tags) =>
                            setCollectionState!((state) => ({
                                ...state,
                                tags: tags as string[],
                            }))
                        }
                    />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="nsfw" className="text-muted-foreground">
                        Контент +18
                    </Label>
                    <Switch
                        checked={nsfw}
                        onCheckedChange={() => handleParamChange('nsfw', !nsfw)}
                        id="nsfw"
                    />
                </div>
                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="spoiler" className="text-muted-foreground">
                        Спойлери
                    </Label>
                    <Switch
                        checked={spoiler}
                        onCheckedChange={() =>
                            handleParamChange('spoiler', !spoiler)
                        }
                        id="spoiler"
                    />
                </div>
                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="private" className="text-muted-foreground">
                        Приватна колекція
                    </Label>
                    <Switch
                        checked={isPrivate}
                        onCheckedChange={() =>
                            handleParamChange('private', !isPrivate)
                        }
                        id="private"
                    />
                </div>

                <div className="flex flex-col gap-4">
                    {mode === 'edit' && (
                        <Button
                            disabled={
                                isUpdatePending ||
                                title.trim().length < 3 ||
                                description.trim().length < 3
                            }
                            variant="default"
                            onClick={() => mutateUpdateCollection()}
                        >
                            {isUpdatePending && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Зберегти
                        </Button>
                    )}
                    {mode === 'create' && (
                        <div className="flex gap-2">
                            <Button
                                className="flex-1"
                                disabled={
                                    isCreatePending ||
                                    title.trim().length < 3 ||
                                    description.trim().length < 3
                                }
                                variant="default"
                                onClick={() => mutateCreateCollection()}
                            >
                                {isCreatePending && (
                                    <span className="loading loading-spinner"></span>
                                )}
                                Створити
                            </Button>
                            <Button
                                size="icon"
                                variant="secondary"
                                onClick={() =>
                                    openModal({
                                        content: (
                                            <AnilistCollection
                                                setCollectionState={
                                                    setCollectionState!
                                                }
                                            />
                                        ),
                                        title: 'Імпорт з AniList',
                                    })
                                }
                            >
                                <SimpleIconsAnilist />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </ScrollArea>
    );
};

export default Component;
