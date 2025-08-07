import { DefaultTheme } from "react-native-paper";
import { ThemeProp } from "react-native-paper/lib/typescript/types";

const theme: ThemeProp = {
	roundness: 0,
	colors: {
		...DefaultTheme.colors,
	},
};
export default theme;
