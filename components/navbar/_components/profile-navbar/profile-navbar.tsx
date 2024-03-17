import React from 'react';

import NotificationsMenu from './_components/notifications-menu';
import ProfileMenu from './_components/profile-menu';

const Component = () => {
    return (
        <div className="flex items-center gap-4">
            <NotificationsMenu />
            <ProfileMenu />
        </div>
    );
};

export default Component;
