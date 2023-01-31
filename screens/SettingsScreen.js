import React, { useState, useEffect } from 'react';
import { View, } from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native'
import { useSelector, useDispatch } from "react-redux";
import { setTheme } from "../app/themeActions";
import { ThemeProvider } from 'styled-components/native';
import { lightTheme, darkTheme } from '../utils/Theme';
import { TextPrimary, MaterialIconCY, } from "../components/ThemeStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
    const [isDarkMode, setIsDarkModeSwitch] = useState(true);
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.themeActions.theme);

    const toggleDarkMode = async value => {
        setIsDarkModeSwitch(value);
        dispatch(value ? setTheme(darkTheme) : setTheme(lightTheme));
        try {
            await AsyncStorage.setItem('darkMode', isDarkMode ? 'light' : 'dark');
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadAppSettings();
    }, [isDarkMode]);

    const loadAppSettings = () => {
        try {
            if (theme !== null && theme.mode === "light") {
                setIsDarkModeSwitch(false);
            } else if (theme !== null && theme.mode === "dark") {
                setIsDarkModeSwitch(true);
            }

        } catch (error) {
            console.error(error);
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
                    onToggle={toggleDarkMode} />

            </View>
        </ThemeProvider>
    );
};

