import React, { useCallback, useState } from 'react'

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

    const [callId, setCallId] = useState(false);
    const [calling, setCalling] = useState(false);

    const updateState = useCallback(async () => {
        if (callId) {
            const response = await fetch(url + '/' + callId, { ...requestInit, method: 'GET' });
            const data = await response.json();
            console.log('updateState', data)
            if (data.conversationName) {
                onSuccess(data)
            }
        }
    }, [callId]);

    const update = useIntervalAsync(updateState, 2000);

    const onCall = (event: React.SyntheticEvent) => {
        event.preventDefault()
        setCalling(true)
        fetch(`${url}`, { ...requestInit, method: 'POST' }).then((res) => { return res.json() })
            .then(data => {
                setCallId(data._id)
                //onSuccess(json)
            }).catch((error) => {
                setCalling(false)
                onError(error)
            })
    };

    return <Button id={id} onClick={onCall}
        disabled={calling}>{text}</Button>
}
export default CallButton;