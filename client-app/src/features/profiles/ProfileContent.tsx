import React from 'react'
import { Tab } from 'semantic-ui-react'
import { ProfileDescription } from './ProfileDescription'
import ProfileFollowings from './ProfileFollowings'
import ProfilePhotos from './ProfilePhotos'

const panes = [
    { menuItem: 'About', render: () => <ProfileDescription /> },
    { menuItem: 'Photos', render: () => <ProfilePhotos /> },
    { menuItem: 'Events', render: () => <Tab.Pane>Events content</Tab.Pane> },
    { menuItem: 'Followers', render: () => <ProfileFollowings /> },
    { menuItem: 'Following', render: () => <ProfileFollowings /> }
]

interface IProps {
    setActiveTab: (activeIndex: any) => void;
}

export const ProfileContent: React.FC<IProps> = ({ setActiveTab }) => {
    return (
        <Tab
            menu={{ fluid: true, vertical: true }}
            menuPosition='right'
            panes={panes}
            onTabChange={(e, data) => setActiveTab(data.activeIndex)}
        // activeIndex={0}
        />
    )
}