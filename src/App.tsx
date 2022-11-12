import * as React from 'react';
import './App.css';

import Slider, { SliderThumb, SliderValueLabelProps } from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

import { emit } from '@tauri-apps/api/event'

import {Widget} from "./modules/WidgetFrame";
import {AppContext} from "./modules/AppContext";
import {CustomTitleBar} from "./modules/CustomToolbar";

//function ValueLabelComponent(props: SliderValueLabelProps) {
//  const { children, value } = props;
//
//  return (
//    <Tooltip open placement="top" title={value}>
//      {children}
//    </Tooltip>
//  );
//}

const marks = [
  { value: 5, label: '5', },
  { value: 10, label: '10', },
  { value: 20, label: '20', },
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

    const {windowPosition, position, notificationType, voice} = React.useContext(AppContext);
    const [positionState, setPositionState] = position;

    const handlePositionChange = (event: Event, value: number | number[]) => {
        const sec = value as number * 60;
        console.log(sec);
        setPositionState(sec);
        //emit('positionState', value as number);
        localStorage.setItem("sstimer-position", JSON.stringify(sec));
    };
    const handlePositionChangeCommited =
        (event : Event | React.SyntheticEvent<Element, Event>,
        value: number | number []) => {
            console.log('change commited');
        };

  return (
    <Widget sx={{ width: 64}}>
      <CustomTitleBar />
      <Box sx={{display: 'flex', justifyContent: 'center'}}>
          <Paper sx={{p: 0.1}} elevation={1}>
              <TinyText align='center'>{formatDuration(positionState)}</TinyText>
          </Paper>
      </Box>
      <Stack sx={{ height: 150, my:1 }} spacing={1} direction="row">
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
        max={30}
      />
      </Stack>
    </Widget>
  );
}

export default App;
