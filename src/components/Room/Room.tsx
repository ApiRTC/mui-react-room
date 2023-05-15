import React from 'react'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
// Note: replaced by usage of Icon, because @mui/icons-material has no umd package available
// import MicIcon from '@mui/icons-material/Mic'
// import MicOffIcon from '@mui/icons-material/MicOff'
import Icon from '@mui/material/Icon'
import { SxProps } from '@mui/material/styles'

import { RegisterInformation } from '@apirtc/apirtc'
import {
    Grid as ApiRtcGrid,
    Stream as ApiRtcStreamComponent,
    Audio, AudioEnableButton,
    MuteButton,
    Video, VideoEnableButton
} from '@apirtc/mui-react-lib'
import {
    Credentials, useCameraStream, useConversation, useConversationStreams, useSession
} from '@apirtc/react-lib'

const video_sizing = { height: '100%', width: '100%' };

export type RoomProps = {
    sx?: SxProps,
    name: string,
    credentials?: Credentials,
    registerInformation?: RegisterInformation,
    onLeave?: () => {}
};
const COMPONENT_NAME = "Room";
const Room = ({ sx, name, credentials, registerInformation, onLeave }: RoomProps) => {

    // setMuiReactLibLogLevel('debug')
    // setReactLibLogLevel('debug')

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

    return <Box sx={{
        ...sx,
        position: 'relative'
    }}>
        <ApiRtcGrid sx={{ height: '100%', width: '100%' }}>
            {subscribedStreams.map((stream, index) =>
                <ApiRtcStreamComponent id={'subscribed-stream-' + index} key={index}
                    sx={{
                        ...(stream.hasVideo() ? video_sizing : { backgroundColor: 'grey' })
                    }}
                    stream={stream} muted={false}
                    controls={<><MuteButton /></>}>
                    {stream.hasVideo() ? <Video
                        sx={video_sizing}
                        style={{
                            ...video_sizing,
                            objectFit: 'cover'
                        }} /> : <Audio />}
                </ApiRtcStreamComponent>
            )}
        </ApiRtcGrid>
        <ApiRtcGrid sx={{
            position: 'absolute',
            bottom: '4px', left: '4px',
            opacity: 0.9,
            height: '34%', width: { xs: '50%', sm: '40%', md: '30%', lg: '20%' },
        }}>
            {publishedStreams.map((stream, index) =>
                <ApiRtcStreamComponent id={'published-stream-' + index} key={index}
                    sx={{
                        ...(stream.hasVideo() ? video_sizing : { backgroundColor: 'grey' })
                    }}
                    stream={stream} muted={true}
                    controls={<>
                        {stream.hasAudio() && <AudioEnableButton />}
                        {stream.hasVideo() && <VideoEnableButton />}
                    </>}>
                    {stream.hasVideo() ?
                        <Video
                            sx={video_sizing}
                            style={{
                                ...video_sizing,
                                objectFit: 'cover'
                            }} /> :
                        <Audio />}
                </ApiRtcStreamComponent>
            )}
        </ApiRtcGrid>

        {/* Hang up button */}
        <Box sx={{
            position: 'absolute',
            //left: '4px', top: '50%', transform: 'translate(0,-50%)', // 4px from left and centered horizontally
            top: '20px', left: '50%', transform: 'translate(-50%,0)'
        }}>
            <IconButton id='leave' color="error" aria-label="leave"
                onClick={doLeave}>
                <Icon>call_end</Icon>
            </IconButton>
        </Box>
    </Box>
}
export default Room;