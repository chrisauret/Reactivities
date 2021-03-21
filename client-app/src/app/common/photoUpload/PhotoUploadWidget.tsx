import React, { Fragment, useEffect, useState } from 'react';
import { Header, Grid, Image } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import PhotoWidgetDropzone from './PhotoWidgetDropzone';

export const PhotoUploadWidget = () => {

    const [files, setFiles] = useState<any>([]); // This state will be passed down 523

    useEffect(() => {
        return () => {
            files.forEach((file: { preview: string; }) => URL.revokeObjectURL(file.preview)); //524
        }
    })

    return (
        <Fragment>
            <Grid>
                <Grid.Column width={4}>
                    <Header color='teal' sub content='Step 1 - Add Photo' />
                    <PhotoWidgetDropzone setFiles={setFiles} />
                </Grid.Column>
                <Grid.Column width={1} />
                <Grid.Column width={4}>
                    <Header sub color='teal' content='Step 2 - Resize image' />
                </Grid.Column>
                <Grid.Column width={1} />
                <Grid.Column width={4}>
                    <Header sub color='teal' content='Step 3 - Preview & Upload' />
                    {files.length > 0 &&
                        <Image src={files[0].preview} />
                    }
                </Grid.Column>
            </Grid>
        </Fragment>
    );
};

export default observer(PhotoUploadWidget);