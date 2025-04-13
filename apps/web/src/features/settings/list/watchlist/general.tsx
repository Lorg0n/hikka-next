'use client';

import Link from 'next/link';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { xml2json } from 'xml-js';

import P from '@/components/typography/p';
import Small from '@/components/typography/small';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/utils';
import FoundList from './found-list';

interface Props {
    watchList: Record<string, any>[];
    setWatchList: Dispatch<SetStateAction<Record<string, any>[]>>;
}

const Component = ({ watchList, setWatchList }: Props) => {
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const nativeType = (value: string) => {
            let nValue = Number(value);
            if (!isNaN(nValue)) {
                return nValue;
            }
            let bValue = value.toLowerCase();
            if (bValue === 'true') {
                return true;
            } else if (bValue === 'false') {
                return false;
            }
            return value;
        };

        const removeJsonTextAttribute = (
            value: string,
            parentElement: Record<string, any>,
        ) => {
            try {
                let keyNo = Object.keys(parentElement._parent).length;
                let keyName = Object.keys(parentElement._parent)[keyNo - 1];

                if (keyName === 'my_comments') {
                    parentElement._parent[keyName] = String(value);
                } else {
                    parentElement._parent[keyName] = nativeType(value);
                }
            } catch (e) {}
        };

        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = Array.from(acceptedFiles)[0];

            const text = await file.text();

            const res = JSON.parse(
                xml2json(text, {
                    compact: true,
                    trim: true,
                    ignoreDeclaration: true,
                    ignoreInstruction: true,
                    ignoreAttributes: true,
                    ignoreComment: true,
                    ignoreCdata: false,
                    ignoreDoctype: true,
                    cdataFn: removeJsonTextAttribute,
                    textFn: removeJsonTextAttribute,
                }),
            );

            if ('myanimelist' in res) {
                setWatchList(res.myanimelist.anime);
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/xml': ['.xml'],
        },
    });

    return (
        <div className="flex w-full flex-col gap-2">
            <Label>Файл списку</Label>
            <div
                {...getRootProps({
                    className: cn(
                        'w-full h-28 p-4',
                        'flex justify-center items-center',
                        'cursor-pointer bg-secondary/20 rounded-lg text-center',
                        'transition duration-100',
                        'hover:bg-secondary/20/90',
                        isDragActive && 'bg-secondary/20/90',
                    ),
                })}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <P className="text-sm text-muted-foreground">
                        Перетягніть файл сюди...
                    </P>
                ) : watchList.length === 0 ? (
                    <P className="text-sm text-muted-foreground">
                        Перетягніть сюди <span>.XML</span> файл, або натисніть,
                        щоб завантажити
                    </P>
                ) : (
                    <FoundList watchList={watchList} />
                )}
            </div>
            <Small className="text-muted-foreground">
                <span>
                    Ви можете імпортувати свій список з{' '}
                    <Link
                        target="_blank"
                        href="https://myanimelist.net/panel.php?go=export"
                        className="text-primary hover:underline"
                    >
                        MyAnimeList
                    </Link>{' '}
                    або <span className="text-primary">Shikimori</span>
                </span>
            </Small>
        </div>
    );
};

export default Component;
