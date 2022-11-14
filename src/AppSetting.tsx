import * as React from 'react';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import IconButton from '@mui/material/IconButton';

import { invoke } from '@tauri-apps/api'

import {AppContext} from './modules/AppContext'

export const AppSetting = () => {
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

    const [notificationTypeState, setNotificationTypeState] = notificationType;
    const [voiceState, setVoiceState] = voice;

    const onNotificationTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = (event.target as HTMLInputElement).value;
        console.log(value);

        setNotificationTypeState(value);
        invoke("cmd_set_notification", {notification: value, index: voiceState});
        localStorage.setItem("sstimer-NotificationType", JSON.stringify(value));
    };

    const onVoiceChange = (event: SelectChangeEvent) => {
        const value = event.target.value as string
        console.log(value);

        setVoiceState(value);
        invoke("cmd_set_notification", {notification: notificationTypeState, index: value});
        localStorage.setItem("sstimer-Voice", JSON.stringify(value));
    };

    const onPlayClick = () => {
        invoke("cmd_play_voice", {notification: notificationTypeState, index: voiceState});
    };

    return (
        <Box margin={3} sx={{ justifyContent: 'center' }}>
            <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">通知方法</FormLabel>
            <RadioGroup
              row
              aria-labelledby="how-to-notify-group-label"
              name="how-to-notify-buttons-group"
              value={notificationTypeState}
              onChange={onNotificationTypeChange}
            >
              <FormControlLabel value="voice" control={<Radio />} label="音+声" />
              <FormControlLabel value="sound" control={<Radio />} label="音" />
              {/*<FormControlLabel value="toast" control={<Radio />} label="トースト" />*/}
            </RadioGroup>
            </FormControl>

            <Stack direction="row" spacing={2}>
                <FormControl size="small" disabled={notificationTypeState !== "voice"}>
                  <Select
                    labelId="voicelabel"
                    id="voice-select"
                    value={voiceState}
                    onChange={onVoiceChange}
                  >
                    <MenuItem value={0}>COEIROINK:おふとんP</MenuItem>
                    <MenuItem value={1}>COEIROINK:KANA</MenuItem>
                    <MenuItem value={2}>COEIROINK:MANA</MenuItem>
                    <MenuItem value={3}>COEIROINK:つくよみちゃん</MenuItem>
                    <MenuItem value={4}>VOICEVOX:四国めたん</MenuItem>
                    <MenuItem value={5}>VOICEVOX:ずんだもん</MenuItem>
                  </Select>
                </FormControl>
                <IconButton onClick={onPlayClick} sx={{ border: 1 }} aria-label="play">
                    <PlayArrowRounded />
                </IconButton>
            </Stack>
        </Box>
    );

}

export default AppSetting;
