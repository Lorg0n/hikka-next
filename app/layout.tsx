import './globals.css';
import Providers from '@/utils/Providers';
import { Inter } from 'next/font/google';
import Footer from '@/app/_layout/Footer';
import React, { ReactNode } from 'react';
import ScrollTop from '@/app/_layout/ScrollTop';
import AuthGate from '@/app/_layout/AuthGate';
import NextTopLoader from 'nextjs-toploader';
import {Metadata, Viewport} from 'next';
import MobileNavBar from '@/app/_layout/MobileNavBar';
import AuthModal from '@/app/_layout/AuthModal';
import SearchModal from '@/app/_layout/SearchModal';
import NavBar from '@/app/_layout/navbar/NavBar';
import SettingsModal from "@/app/_layout/UserSettingsModal";

export const runtime = 'edge';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: {
        default: 'Hikka - енциклопедія аніме українською',
        template: '%s / Hikka',
    },
    description:
        'Hikka - українська онлайн енциклопедія аніме. Весь список аніме, детальна інформація до кожного тайтлу та зручний інтерфейс. Заповнюй власний список переглянутого, кастомізуй профіль та ділись з друзями.',
    keywords: [
        'онлайн перегляд аніме',
        'аніме',
        'аніме українською',
        'мультфільми українською',
        'дивитись аніме',
        'аніме для дорослих',
        'anime',
        'аніме романтика',
        'аніме комедія',
        'аніме школа',
        'хіка',
        'хікка',
        'hikka',
        'hikka.io',
        'хіка іо',
        'енциклопедія аніме',
        'анітуб',
        'anitube',
        'аніме жанри',
        'онлайн на українській',
        'жанри аніме',
        'anime ukr',
        'анітюб',
        'Найкраще аніме',
        'аніме портал',
        'Аніме Портал',
        'аніме культура',
    ],
    openGraph: {
        images: '/preview.jpg',
        title: {
            default: 'Hikka - енциклопедія аніме українською',
            template: '%s / Hikka',
        },
        description:
            'Hikka - українська онлайн енциклопедія аніме. Весь список аніме, детальна інформація до кожного тайтлу та зручний інтерфейс. Заповнюй власний список переглянутого, кастомізуй профіль та ділись з друзями.',
    },
    twitter: {
        images: '/preview.jpg',
        title: {
            default: 'Hikka - енциклопедія аніме українською',
            template: '%s / Hikka',
        },
        description:
            'Hikka - українська онлайн енциклопедія аніме. Весь список аніме, детальна інформація до кожного тайтлу та зручний інтерфейс. Заповнюй власний список переглянутого, кастомізуй профіль та ділись з друзями.',
    },
    metadataBase: new URL('https://hikka.io'),
};

export const viewport: Viewport = {
    colorScheme: 'dark',
    themeColor: 'black',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
}

export default async function RootLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <html lang="uk" data-theme="dark">
            <body className={inter.className}>
                <NextTopLoader color="#e779c1" />
                <Providers>
                    <AuthGate>
                        <SettingsModal />
                        <AuthModal />
                        <SearchModal />
                        <ScrollTop />
                        <div className="drawer drawer-end top-0 left-0 right-0 sticky z-10">
                            <input
                                id="mobileNavDrawer"
                                type="checkbox"
                                className="drawer-toggle"
                            />
                            <div className="drawer-content overflow-hidden">
                                <NavBar />
                            </div>
                            <div className="drawer-side overflow-y-visible z-10 lg:hidden">
                                <label
                                    htmlFor="mobileNavDrawer"
                                    aria-label="close sidebar"
                                    className="drawer-overlay"
                                ></label>
                                <MobileNavBar />
                            </div>
                        </div>
                        <main className="container max-w-screen-xl mx-auto px-4 lg:mt-20 mt-8">
                            {children}
                        </main>
                        <div id="subbar-mobile" className="no-scrollbar mt-12 md:hidden block w-full sticky bottom-0 overflow-auto bg-black border-t border-t-secondary" />
                        <Footer />
                    </AuthGate>
                </Providers>
            </body>
        </html>
    );
}
