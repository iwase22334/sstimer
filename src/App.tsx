import * as React from 'react';
import './App.css';

import Slider, { SliderThumb, SliderValueLabelProps } from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/tauri';
import { appWindow, PhysicalPosition, currentMonitor, LogicalSize} from '@tauri-apps/api/window';

import {Widget} from "./modules/WidgetFrame";
import {AppContext} from "./modules/AppContext";
import {CustomTitleBar} from "./modules/CustomToolbar";

const marks = [
  { value: 15, label: '15', },
  { value: 30, label: '30', },
  { value: 45, label: '45', },
];

const TinyText = styled(Typography)({
  fontSize: '1rem',
  letterSpacing: 0.2,
});

const formatDuration = (sec: number) => {
  const minute = Math.floor(sec / 60);
  const secondLeft = sec - minute * 60;
  return `${minute < 10 ? `0${minute}` : minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
}

const PrettoSlider = styled(Slider)({
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    backgroundColor: '#fff',
    border: '1px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
});

function App() {
    // Ignore right click on setting view
    document.addEventListener(
        "contextmenu",
        (event) => {
            console.log(event);
            event.preventDefault();
        },
        { capture: true }
    );

    const {windowPosition, notificationType, voice} = React.useContext(AppContext);
    const [winPositionState, setWinPositionState] = windowPosition;
    const [notificationTypeState, setNotificationTypeState] = notificationType;
    const [voiceState, setVoiceState] = voice;

    const [positionState, setPositionState] = React.useState(0);

    React.useEffect(() => {
        invoke("cmd_set_notification", {notification: notificationTypeState, index: voiceState});

        const _unlisten = appWindow.onMoved(({ payload: position }) => {
            console.log('Window moved', position);
            if (position.x != -32000) {
                localStorage.setItem("sstimer-WindowPosition", JSON.stringify(position));
                console.log('Window is moved');
            } else {
                console.log('Window is minimized');
            }
        });

        appWindow.setPosition(new PhysicalPosition(winPositionState.x, winPositionState.y));
        appWindow.setSize(new LogicalSize(72, 230));

    }, []);

    React.useEffect(() => {
        const unlisten = listen('currentTime', (event) => {
            console.log(event.payload as number);
            setPositionState(event.payload as number);
        });
    }, []);

    const handlePositionChange = (event: Event, value: number | number[]) => {
        const sec = value as number * 60;
        console.log('value changed', sec);
        invoke('cmd_set_stop');
        setPositionState(sec);
    };

    const handlePositionChangeCommited =
        (event : Event | React.SyntheticEvent<Element, Event>,
        value: number | number []) => {
            const sec = value as number * 60;

            console.log('change commited');
            setPositionState(sec);

            if (sec != 0) {
                invoke('cmd_set_start', {secs : sec});
            }
        };

  return (
    <Widget sx={{ width: 64}} data-tauri-drag-region>
      <CustomTitleBar />
      <Box sx={{display: 'flex', justifyContent: 'center'}}>
          <Paper sx={{p: 0.1}} elevation={1}>
              <TinyText align='center'>{formatDuration(positionState)}</TinyText>
          </Paper>
      </Box>
      <Stack sx={{ height: 150, my:1 }} spacing={1} direction="row" data-tauri-drag-region>
      <Box/>
      <PrettoSlider
        orientation="vertical"
        sx={{ width:19 }}
        value={positionState / 60}
        onChange={handlePositionChange}
        onChangeCommitted={handlePositionChangeCommited}
        marks={marks}
        step={1}
        min={0}
        max={60}
      />
      </Stack>
    </Widget>
  );
}

export default App;
