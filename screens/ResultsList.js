import DayList from "../components/DayList";
import { ThemeProvider } from 'styled-components/native';
import { useSelector, } from "react-redux";
import { BackgroundPrimary, } from "../components/ThemeStyles";

function ResultsList({ searchText, primaryMood, secondaryMood }) {
    const theme = useSelector((state) => state.themeActions.theme);

    return (
        <ThemeProvider theme={theme}>

            <BackgroundPrimary style={{
                flexDirection: "row",
                justifyContent: "space-around"
            }}>
                <DayList
                    style={{ flex: 1 }}
                    newEntry={false}
                    isSingleDate={false}
                    mood={primaryMood}
                    searchText={searchText}
                />

                <DayList
                    style={{ flex: 1 }}
                    newEntry={false}
                    isSingleDate={false}
                    mood={secondaryMood}
                    searchText={searchText}
                />
            </BackgroundPrimary>
        </ThemeProvider>

    );
}

export default ResultsList;
