import React from 'react'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
// Note: replaced by usage of Icon, because @mui/icons-material has no umd package available
// import MicIcon from '@mui/icons-material/Mic'
// import MicOffIcon from '@mui/icons-material/MicOff'
import Icon from '@mui/material/Icon'

import { RegisterInformation } from '@apirtc/apirtc'
import {
    AudioEnableButton, Grid as StreamsGrid, MuteButton, Stream as StreamComponent, VideoEnableButton
} from '@apirtc/mui-react-lib'
import { Credentials, useCameraStream, useConversation, useConversationStreams, useSession } from '@apirtc/react-lib'

export type RoomProps = {
    name: string,
    credentials?: Credentials,
    registerInformation?: RegisterInformation,
    onLeave?: () => {}
};
const COMPONENT_NAME = "Room";
const Room = ({ name, credentials, registerInformation, onLeave }: RoomProps) => {

    // ApiRTC react-lib hooks
    const { session } = useSession(credentials ?? { apiKey: "myDemoApiKey" }, registerInformation);
    const { stream: localStream } = useCameraStream(session);
    const { conversation, leave } = useConversation(session, name);
    const { publishedStreams, subscribedStreams } = useConversationStreams(conversation,
        localStream ? [{ stream: localStream }] : []);
    // ApiRTC react-lib hooks

    const doLeave = (event: React.SyntheticEvent) => {
        event.preventDefault()
        leave().finally(() => {
            if (onLeave) {
                onLeave()
            }
        })
    };

    return <Stack direction="column">
        <Box sx={{
            position: 'relative',
            minHeight: '360px', minWidth: '640px',
        }}>

            {/* Remote streams */}
            <StreamsGrid>
                {subscribedStreams.map((stream, index) =>
                    <StreamComponent id={'subscribed-stream-' + index} key={index}
                        stream={stream} muted={false}
                        controls={<><AudioEnableButton disabled={true} /><MuteButton /></>}
                    />
                )}
            </StreamsGrid>

            {/* Local streams */}
            <StreamsGrid sx={{
                position: 'absolute',
                bottom: '4px', left: '4px',
                opacity: [0.9, 0.8, 0.7],
                maxWidth: '128px'
            }}>
                {publishedStreams.map((stream, index) =>
                    <StreamComponent id={'published-stream-' + index} key={index}
                        videoStyle={{ maxWidth: '100%' }}
                        stream={stream} muted={true}
                        controls={<><AudioEnableButton /><VideoEnableButton /></>} />
                )}
            </StreamsGrid>

            {/* Hang up button */}
            <Box sx={{
                position: 'absolute',
                left: '4px', top: '50%', transform: 'translate(0,-50%)', // 4px from left and centered horizontally
            }}>
                <IconButton id='leave' color="error" aria-label="leave"
                    onClick={doLeave}>
                    <Icon>call_end</Icon>
                </IconButton>
            </Box>
        </Box>
    </Stack>
}
export default Room;