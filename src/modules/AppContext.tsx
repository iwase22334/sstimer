import * as React from 'react';
import { PhysicalPosition } from '@tauri-apps/api/window';

type Props = { children: React.ReactNode }

type AppContextType = {
    windowPosition:   [PhysicalPosition, React.Dispatch<PhysicalPosition>],
    position:         [number, React.Dispatch<number>],
    notificationType: [string, React.Dispatch<string>],
    voice:            [string, React.Dispatch<string>],
}

export const AppContext = React.createContext({} as AppContextType);

export const AppContextProvider: React.FC<Props> = (props) => {
    const [winPosition, setWinPosition] = React.useState(() => {
        const json = localStorage.getItem("sstimer-WindowPosition");
        const initWinPosition = json === null ? null : JSON.parse(json);

        return initWinPosition === null ? {x: 10, y: 10} : initWinPosition;
    });

    const [position, setPosition] = React.useState(() => {
        const json = localStorage.getItem("sstimer-posisiton");
        const initPosition = json === null ? null : JSON.parse(json);

        return initPosition === null ? 15 * 60 : initPosition;
    })

    const [notificationType, setNotificationType] = React.useState(() => {
        const json = localStorage.getItem("sstimer-NotificationType");
        const initNotificationType = json === null ? null : JSON.parse(json);

        return initNotificationType === null ? 'voice' : initNotificationType;
    });

    const [voice, setVoice] = React.useState(() => {
        const json = localStorage.getItem("sstimer-Voice");
        const initVoice = json === null ? null : JSON.parse(json);

        return initVoice === null ? 0: initVoice;
    });

    return(
        <AppContext.Provider value = {{
            windowPosition: [winPosition, setWinPosition],
            position: [position, setPosition],
            notificationType: [notificationType, setNotificationType],
            voice: [voice, setVoice]
            }}>

            {props.children}
        </AppContext.Provider>
    )
}
