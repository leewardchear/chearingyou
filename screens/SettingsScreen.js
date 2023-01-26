import React, { useState, useEffect } from 'react';
import { View, } from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native'
import { useSelector, useDispatch } from "react-redux";
import { setTheme } from "../app/themeActions";
import { ThemeProvider } from 'styled-components/native';
import { lightTheme, darkTheme } from '../utils/Theme';
import { TextPrimary, MaterialIconCY, } from "../components/ThemeStyles";

export default function SettingsScreen() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.themeActions.theme);

    useEffect(() => {
        if (theme.mode === 'light') {
            setIsDarkMode(false)
        } else {
            setIsDarkMode(true)
        }
    }, [isDarkMode]);


    const handleSwitchPressed = () => {
        if (theme.mode === 'light') {
            dispatch(setTheme(darkTheme))
            setIsDarkMode(true)
        } else {
            dispatch(setTheme(lightTheme))
            setIsDarkMode(false)
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <View style={{ padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                <TextPrimary style={{
                    fontSize: 22,
                    fontWeight: "bold",
                }}>Settings</TextPrimary>

            </View>

            <View style={{
                paddingTop: 10,
                flexDirection: "row",
                justifyContent: "space-between",
            }}>
                <View style={{ paddingStart: 20, paddingBottom: 20, flexDirection: "row" }}>
                    <MaterialIconCY
                        name="moon-o"
                        size={25}
                    />

                    <TextPrimary style={{
                        paddingStart: 15,
                        fontSize: 18,
                    }}>Dark Theme</TextPrimary>

                </View>

                <ToggleSwitch
                    style={{ paddingEnd: 25 }}
                    isOn={isDarkMode}
                    onColor={theme.PRIMARY_THEME}
                    offColor={theme.SECONDARY_THEME}
                    labelStyle={{ color: "black", fontWeight: "50" }}
                    size="medium"
                    onToggle={handleSwitchPressed} />

            </View>
        </ThemeProvider>
    );
};

