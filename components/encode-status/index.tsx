import { TEncodeStatus } from "@/types";
import { Text, View } from "react-native";
import { ActivityIndicator, Icon, useTheme } from "react-native-paper";

interface IProps {
	encodeStatus: TEncodeStatus;
}

const EncodeStatusText = (status: TEncodeStatus) => {
	switch (status) {
		case "failed":
			return "Encoded failed, please try again";
		case "finished":
			return "Encoded finished";
		default:
			return "Encoding";
	}
};
const EncodeStatusIcon = (status: TEncodeStatus) => {
	const theme = useTheme();
	switch (status) {
		case "failed":
			return <Icon size={20} source="close" color={theme.colors.error} />;
		case "finished":
			return <Icon size={20} source="check" color={"green"} />;
		default:
			return <ActivityIndicator size={20} />;
	}
};

export default function EncodeStatus(props: IProps) {
	return (
		<View style={{ flexDirection: "row", gap: 10 }}>
			<View style={{ width: 20 }}>{EncodeStatusIcon(props.encodeStatus)}</View>
			<Text>{EncodeStatusText(props.encodeStatus)}</Text>
		</View>
	);
}
