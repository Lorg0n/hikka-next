import H1 from '@/components/typography/h1';
import Small from '@/components/typography/small';

const AuthCallbackHeader = () => {
    return (
        <div className="space-y-2 text-center">
            <H1 className="!text-3xl font-bold">Авторизація</H1>
            <Small className="text-muted-foreground">
                Очікуємо підтвердження авторизації...
            </Small>
        </div>
    );
};

export default AuthCallbackHeader;
