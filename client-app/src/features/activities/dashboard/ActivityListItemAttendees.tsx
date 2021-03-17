import React from 'react'
import { List, Image } from 'semantic-ui-react'
import { IAttendee } from '../../../models/activity'

interface IProps {
    attendees: IAttendee[];
}

export const ActivityListItemAttendees: React.FC<IProps> = ({ attendees }) => {
    return (
        <List horizontal>
            {attendees.map(attendee => (
                <List.Item>
                    <Image size='mini' circular src={attendee.image || '/assets/user.png'} />
                </List.Item>
            ))}
        </List>
    )
}
