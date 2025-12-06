import { Metadata } from 'next';
import { FC } from 'react';

import { AuthCallbackForm, AuthCallbackHeader } from '@/features/auth';

import _generateMetadata from '@/utils/generate-metadata';

export const metadata: Metadata = _generateMetadata({
    title: 'Авторизація',
});

const AuthCallbackPage: FC = () => {
    return (
        <div className="w-full space-y-6">
            <AuthCallbackHeader />
            <AuthCallbackForm />
        </div>
    );
};

export default AuthCallbackPage;
