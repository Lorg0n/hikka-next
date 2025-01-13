'use client';

import NotFound from '@/components/ui/not-found';
import useClients from '@/services/hooks/auth/use-thirdparty-tokens';
import AuthTokenItem from './auth-token-item';

const Component = () => {
    const { data } = useClients();

    return (
        <div className="flex w-full flex-col gap-6">
            {data && data.list.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                    {data?.list?.map((item) => (
                        <AuthTokenItem key={item.reference} authToken={item} />
                    ))}
                </div>
            ) : (
                <NotFound
                    title="Не знайдено пов'язаних застосунків"
                    description="Авторизуйтесь десь за допомогою стороннього застосунку"
                />
            )}
        </div>
    );
};

export default Component;
