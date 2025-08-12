import theme from "@/theme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";

export default function RootLayout() {
	return (
		<PaperProvider theme={theme}>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen name="+not-found" />
			</Stack>
		</PaperProvider>
	);
}
