export * from './components'

type LogLevel = {
    level: 'debug' | 'info' | 'warn' | 'error'
    isDebugEnabled: boolean
    isInfoEnabled: boolean
    isWarnEnabled: boolean
}

const INFO: LogLevel = { level: 'info', isDebugEnabled: false, isInfoEnabled: true, isWarnEnabled: true };

declare global {
    var apirtcMuiReactRoomLogLevel: LogLevel;
    var setApirtcMuiReactRoomLogLevel: Function
}

// a default value MUST be set in case application using the library does not override it
globalThis.apirtcMuiReactRoomLogLevel = INFO;

export function setLogLevel(logLevelText: 'debug' | 'info' | 'warn' | 'error' | string) {
    switch (logLevelText) {
        case 'debug':
            globalThis.apirtcMuiReactRoomLogLevel = { level: 'debug', isDebugEnabled: true, isInfoEnabled: true, isWarnEnabled: true };
            break
        case 'info':
            globalThis.apirtcMuiReactRoomLogLevel = INFO;
            break
        case 'warn':
            globalThis.apirtcMuiReactRoomLogLevel = { level: 'warn', isDebugEnabled: false, isInfoEnabled: false, isWarnEnabled: true };
            break
        case 'error':
            globalThis.apirtcMuiReactRoomLogLevel = { level: 'error', isDebugEnabled: false, isInfoEnabled: false, isWarnEnabled: false };
            break
        default:
            // in case null is passed as input, default to 'info'
            globalThis.apirtcMuiReactRoomLogLevel = INFO;
    }
    return globalThis.apirtcMuiReactRoomLogLevel
}

globalThis.setApirtcMuiReactRoomLogLevel = setLogLevel;