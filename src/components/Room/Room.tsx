import React, { useEffect, useMemo } from 'react'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import { RegisterInformation } from '@apirtc/apirtc'

import { Credentials, useSession, useCameraStream, useConversation, useConversationStreams } from '@apirtc/react-lib'

import { AudioEnableButton, MuteButton, Stream as StreamComponent, Grid as RemoteStreamsGrid } from '@apirtc/mui-react-lib'

export type RoomProps = {
    name: string,
    credentials?: Credentials,
    registerInformation?: RegisterInformation
};
const Room = ({ name, credentials, registerInformation }: RoomProps) => {

    const { session } = useSession(credentials ?? { apiKey: "myDemoApiKey" }, registerInformation);
    const { stream: localStream } = useCameraStream(session);
    const { conversation } = useConversation(session, name, undefined, true);
    const { publishedStreams, subscribedStreams } = useConversationStreams(conversation,
        localStream ? [{ stream: localStream }] : []);

    const displayStreams = useMemo(() => localStream ? Array(8).fill(localStream) : [], [localStream])
    //const displayStreams = useMemo(() => subscribedStreams.length > 0 ? Array(9).fill(subscribedStreams[0]) : [], [subscribedStreams])

    return <Box sx={{
        position: 'relative',
        minHeight: '360px', minWidth: '640px',
    }}>

        {/* <RemoteStreamsGrid> */}
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, auto)',
            gridTemplateRows: 'auto auto',
        }}>
            {displayStreams.map((stream, index) =>
                // <Box sx={{ maxHeight: '33vh' }}>
                <StreamComponent id={'subscribed-stream-' + index} key={index}
                    stream={stream} muted={false}
                    controls={<><MuteButton /><AudioEnableButton /></>} />
                // </Box>
            )}
        </Box>
        {/* </RemoteStreamsGrid> */}
        <Grid container direction="row" justifyContent="flex-start"
            sx={{
                position: 'absolute',
                bottom: 0, left: 0,
                opacity: [0.9, 0.8, 0.7],
            }}>
            {publishedStreams.map((stream, index) =>
                <Grid item id={'published-stream-' + index} key={index} xs={4} md={3} lg={2}>
                    <StreamComponent stream={stream} muted={true}
                        controls={<AudioEnableButton />} />
                </Grid>)}
        </Grid>
    </Box>
}
export default Room;