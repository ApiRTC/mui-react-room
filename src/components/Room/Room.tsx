import React, { useEffect, useMemo } from 'react'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'

import IconButton from '@mui/material/IconButton'

// Note: replaced by usage of Icon, because @mui/icons-material has no umd package available
// import MicIcon from '@mui/icons-material/Mic'
// import MicOffIcon from '@mui/icons-material/MicOff'
import Icon from '@mui/material/Icon'

import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'

import { RegisterInformation } from '@apirtc/apirtc'

import { Credentials, useSession, useCameraStream, useConversation, useConversationStreams } from '@apirtc/react-lib'

import {
    AudioEnableButton, MuteButton, Stream as StreamComponent, Grid as StreamsGrid,
    useToggle
} from '@apirtc/mui-react-lib'

export type RoomProps = {
    name: string,
    credentials?: Credentials,
    registerInformation?: RegisterInformation,
    onLeave: () => {}
};
const COMPONENT_NAME = "Room";
const Room = ({ name, credentials, registerInformation, onLeave }: RoomProps) => {

    const { session } = useSession(credentials ?? { apiKey: "myDemoApiKey" }, registerInformation);
    const { stream: localStream } = useCameraStream(session);
    const { conversation } = useConversation(session, name, undefined, true);
    const { publishedStreams, subscribedStreams, unpublish } = useConversationStreams(conversation,
        localStream ? [{ stream: localStream }] : []);

    // const { status: snackbar, toggleStatus: toggleSnackbar } = useToggle(false);

    //const displayStreams = useMemo(() => localStream ? Array(8).fill(localStream) : [], [localStream])
    //const displayStreams = useMemo(() => subscribedStreams.length > 0 ? Array(9).fill(subscribedStreams[0]) : [], [subscribedStreams])

    const doLeave = (event: React.SyntheticEvent) => {
        event.preventDefault()

        // TODO : works better if unpublish is called (otherwise the stream is not removed
        // asap in remote applications connected to the conversation)
        // To be checked with Fred to improve this..
        if (localStream) {
            unpublish(localStream)
        }
        //leave().finally(() => {
        console.info(`${COMPONENT_NAME}|leave`)
        if (onLeave) {
            onLeave()
        }
    }

    return <Stack direction="row">

        <Stack direction="column"
        //  sx={{
        //     minWidth: '240px', maxWidth: '240px',
        // }}
        >
            {/* <Divider variant="middle" flexItem /> */}
            <IconButton id='leave' color="error" aria-label="leave"
                onClick={doLeave}>
                <Icon>call_end</Icon>
            </IconButton>
        </Stack>

        <Divider sx={{ mx: 1 }} orientation="vertical" variant="middle" flexItem />

        <Box sx={{
            position: 'relative',
            minHeight: '360px', minWidth: '640px',
        }}>
            <StreamsGrid>
                {subscribedStreams.map((stream, index) =>
                    <StreamComponent id={'subscribed-stream-' + index} key={index}
                        stream={stream} muted={false}
                        controls={<><AudioEnableButton disabled={true} /><MuteButton /></>}
                    // videoStyle={{ maxHeight: '33vh' }}
                    />
                )}
            </StreamsGrid>
            <StreamsGrid sx={{
                position: 'absolute',
                bottom: '4px', left: '4px',
                opacity: [0.9, 0.8, 0.7],
                maxWidth: '128px',
                border: 1,
                borderColor: 'primary.main'
            }}>
                {publishedStreams.map((stream, index) =>
                    <StreamComponent id={'published-stream-' + index} key={index}
                        videoStyle={{ maxWidth: '100%' }}
                        stream={stream} muted={true}
                        controls={<AudioEnableButton />} />
                )}
            </StreamsGrid>
        </Box>
    </Stack>
}
export default Room;

{/* <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={snackbar}
            onClose={toggleSnackbar}
            message="I love snacks"
        // key=''
        /> */}

// return <Box sx={{
//     position: 'relative',
//     minHeight: '360px', minWidth: '640px',
// }}>

//     <RemoteStreamsGrid>
//         {/* <Box sx={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(4, auto)',
//         // gridTemplateRows: 'auto auto',
//         maxWidth: '100vw',
//         maxHeight: '100vh'
//     }}> */}
//         {subscribedStreams.map((stream, index) =>
//             <StreamComponent id={'subscribed-stream-' + index} key={index}
//                 // sx={{ maxWidth: '100%' }}
//                 stream={stream} muted={false}
//                 controls={<><AudioEnableButton disabled={true} /><MuteButton /></>}
//                 videoStyle={{ maxHeight: '33vh' }}
//             />
//         )}
//         {/* </Box> */}
//     </RemoteStreamsGrid>
//     <Grid container direction="row" justifyContent="flex-start"
//         sx={{
//             position: 'absolute',
//             bottom: 0, left: 0,
//             opacity: [0.9, 0.8, 0.7],
//         }}>
//         {publishedStreams.map((stream, index) =>
//             <Grid item id={'published-stream-' + index} key={index} xs={4} md={3} lg={2}>
//                 <StreamComponent
//                     videoStyle={{ maxWidth: '100%' }}
//                     stream={stream} muted={true}
//                     controls={<AudioEnableButton />} />
//             </Grid>)}
//     </Grid>
//     <Stack direction="row"
//         sx={{
//             position: 'absolute',
//             top: 4, left: '50%', transform: 'translate(-50%)', // 4px from top and centered horizontally
//             opacity: [0.9, 0.8, 0.7],
//         }}>
//         <IconButton id='leave' color="error" aria-label="leave"
//             onClick={doLeave}>
//             <Icon>call_end</Icon>
//         </IconButton>
//     </Stack>
// </Box>