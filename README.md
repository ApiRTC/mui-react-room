# mui-react-lib

This package offers **React/MUI** **Room** component.

It is based on @apirtc/react-lib and @apirtc/mui-react-lib

## Install

`npm install @apirtc/mui-react-room`

also you will need to install

'<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />'

in index.html <head> to make Icon work

## DEV

`sudo npm link ../m-visio-assist/node_modules/@apirtc/apirtc ../m-visio-assist/node_modules/react ../m-visio-assist/node_modules/@apirtc/react-lib ../m-visio-assist/node_modules/@apirtc/mui-react-lib`

## Components

### Room

Use it to display any **ApiRTC** remote **Stream**.

```
import { Room } from '@apirtc/mui-react-room'

<Room name={'room_name'} credentials={{ apiKey : "myDemoApiKey" }}></Room>
```

## Configure log level

Available log levels:

 * **debug**
 * **info**
 * **warn**
 * **error**

from web app code:

```
import { setLogLevel } from '@apirtc/mui-react-room'

setLogLevel('warn')
```

from console:

```
ApiRtcMuiReactRoom.setLogLevel('debug')
```
