'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputTags } from '@/components/ui/input-tags';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import GroupInputs from '@/features/collections/collection-edit/collection-settings/group-inputs';

import useCreateCollection from '@/services/hooks/collections/use-create-collection';
import useUpdateCollection from '@/services/hooks/collections/use-update-collection';
import { useCollectionContext } from '@/services/providers/collection-provider';
import { useModalContext } from '@/services/providers/modal-provider';
import {
    COLLECTION_CONTENT_TYPE_OPTIONS,
    COLLECTION_VISIBILITY_OPTIONS,
} from '@/utils/constants/common';

interface Props {
    mode?: 'create' | 'edit';
}

const CollectionSettings: FC<Props> = ({ mode = 'create' }) => {
    const { openModal } = useModalContext();
    const params = useParams();

    const groups = useCollectionContext((state) => state.groups);
    const title = useCollectionContext((state) => state.title);
    const nsfw = useCollectionContext((state) => state.nsfw);
    const spoiler = useCollectionContext((state) => state.spoiler);
    const visibility = useCollectionContext((state) => state.visibility);
    const content_type = useCollectionContext((state) => state.content_type);
    const description = useCollectionContext((state) => state.description);
    const tags = useCollectionContext((state) => state.tags);
    const getApiData = useCollectionContext((state) => state.getApiData);

    const addGroup = useCollectionContext((state) => state.addGroup);
    const setTitle = useCollectionContext((state) => state.setTitle);
    const setTags = useCollectionContext((state) => state.setTags);
    const setContentType = useCollectionContext(
        (state) => state.setContentType,
    );
    const setVisibility = useCollectionContext((state) => state.setVisibility);
    const setNsfw = useCollectionContext((state) => state.setNsfw);
    const setSpoiler = useCollectionContext((state) => state.setSpoiler);

    const { mutate: mutateCreateCollection, isPending: isCreatePending } =
        useCreateCollection({
            ...getApiData(),
        });

    const { mutate: mutateUpdateCollection, isPending: isUpdatePending } =
        useUpdateCollection({
            ...getApiData(),
            reference: String(params.reference),
        });

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
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <Label className="text-muted-foreground">Групи</Label>
                    {groups.length > 0 &&
                        groups.some((group) => group.isGroup) && (
                            <GroupInputs />
                        )}
                    <Button variant="secondary" onClick={addGroup}>
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
                        onChange={(tags) => setTags(tags as string[])}
                    />
                </div>

                {mode === 'create' && (
                    <div className="flex flex-col gap-4">
                        <Label
                            htmlFor="private"
                            className="text-muted-foreground"
                        >
                            Тип
                        </Label>
                        <Select
                            disabled={groups.some((g) => g.items.length > 0)}
                            value={[content_type]}
                            onValueChange={(value) =>
                                setContentType(value[0] as API.ContentType)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectList>
                                    <SelectGroup>
                                        {COLLECTION_CONTENT_TYPE_OPTIONS.map(
                                            (option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectGroup>
                                </SelectList>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <Label htmlFor="private" className="text-muted-foreground">
                        Відображення
                    </Label>

                    <Select
                        value={[visibility]}
                        onValueChange={(value) =>
                            setVisibility(
                                value[0] as 'private' | 'public' | 'unlisted',
                            )
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectList>
                                <SelectGroup>
                                    {COLLECTION_VISIBILITY_OPTIONS.map(
                                        (option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectGroup>
                            </SelectList>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="nsfw" className="text-muted-foreground">
                        Контент +18
                    </Label>
                    <Switch
                        checked={nsfw}
                        onCheckedChange={() => setNsfw(!nsfw)}
                        id="nsfw"
                    />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="spoiler" className="text-muted-foreground">
                        Спойлери
                    </Label>
                    <Switch
                        checked={spoiler}
                        onCheckedChange={() => setSpoiler(!spoiler)}
                        id="spoiler"
                    />
                </div>

                <div className="flex flex-col gap-4">
                    {mode === 'edit' && (
                        <Button
                            disabled={
                                isUpdatePending ||
                                !title ||
                                title.trim().length < 3 ||
                                !description ||
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
                                    !title ||
                                    title.trim().length < 3 ||
                                    !description ||
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
                        </div>
                    )}
                </div>
            </div>
        </ScrollArea>
    );
};

export default CollectionSettings;
