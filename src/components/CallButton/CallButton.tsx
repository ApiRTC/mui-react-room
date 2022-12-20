import React, { useCallback, useRef, useState } from 'react'

import Button from '@mui/material/Button'

import useIntervalAsync from '../../hooks/useIntervalAsync'

export type CallButtonProps = {
    url: string,
    requestInit?: RequestInit,
    id?: string,
    text?: string,
    onSuccess?: (data: any) => void,
    onError?: (error: string) => void
};
const CallButton = ({
    url,
    requestInit,
    id,
    text = 'Call',
    onSuccess = () => { },
    onError = () => { }
}: CallButtonProps) => {

    const [callId, setCallId] = useState(undefined);
    const postInProgress = useRef(false);

    const getCallStatus = useCallback(async () => {
        const response = await fetch(url + '/' + callId, { ...requestInit, method: 'GET' });
        const data = await response.json();
        console.log('getCallStatus returned', data)
        if (data.conversationName) {
            onSuccess(data)
            setCallId(undefined)
        }
    }, [callId]);

    useIntervalAsync(callId ? getCallStatus : null, 2000);

    const onCall = (event: React.SyntheticEvent) => {
        event.preventDefault()
        postInProgress.current = true;
        fetch(`${url}`, { ...requestInit, method: 'POST' }).then((res) => { return res.json() })
            .then(data => {
                setCallId(data._id)
            }).catch((error) => {
                onError(error)
            }).finally(() => {
                postInProgress.current = false;
            })
    };

    return <Button id={id} variant="contained"
        onClick={onCall}
        disabled={callId ? true : postInProgress.current}>{text}</Button>
}
export default CallButton;