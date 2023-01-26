import styled from 'styled-components/native'
import { Text, View } from 'react-native';
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export const TextPrimary = styled(Text)`
color: ${props => props.theme.PRIMARY_TEXT_COLOR};
`;

export const TextSecondary = styled(Text)`
color: ${props => props.theme.SECONDARY_TEXT_COLOR};
`;

export const BackgroundPrimary = styled(View)`
backgroundColor: ${props => props.theme.PRIMARY_BACKGROUND_COLOR};
flex: 1;
`;

export const BackgroundSecondary = styled(View)`
backgroundColor: ${props => props.theme.SECONDARY_BACKGROUND_COLOR};
`;

export const MaterialIconCY = styled(MaterialCommunityIcons)`
color: ${props => props.theme.PRIMARY_TEXT_COLOR};
`;

export const FontAwesomeCY = styled(FontAwesomeIcons)`
color: ${props => props.theme.PRIMARY_TEXT_COLOR};
`;
