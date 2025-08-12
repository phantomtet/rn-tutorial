import api from "@/api/axios";
import EncodeStatus from "@/components/encode-status";
import { TEncodeStatus } from "@/types";
import { objectToFormData, uploadFileInChunksOptimized } from "@/utils";
import * as DocumentPicker from "expo-document-picker";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, ProgressBar, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UploadPage() {
	const [progress, setProgress] = useState(0);
	const [encodeStatus, setEncodeStatus] = useState<TEncodeStatus>("pending");

	const handleUploadBigFile = async () => {
		setProgress(0);
		const result = await DocumentPicker.getDocumentAsync();
		let mergeString: string[] = [];
		if (result.canceled) return;
		const file = result.assets[0];
		try {
			await uploadFileInChunksOptimized(
				file,
				(index, data, isLast) => {
					mergeString.push(data);

					return api.post("/", {
						chunkIndex: index,
						data,
						isLast,
						fileId: "123abc", // generate unique id here
					});
				},
				(percentage) => {
					setProgress((prev) => (prev < percentage ? percentage : prev));
				},
			);
			console.log("success");
		} catch (error) {
			console.log("err", error);
		}
	};

	return (
		<SafeAreaView style={{ padding: 10, borderWidth: 2 }}>
			<Button mode="contained" onPress={handleUploadBigFile}>
				Choose a video
			</Button>
			<Button onPress={handleUploadBigFile}>Upload</Button>
			<Text>Progress bar: {progress}</Text>
			<ProgressBar progress={progress} />
			<View
				style={{
					display: progress === 1 ? "flex" : "none",
					marginTop: 10,
				}}
			>
				<EncodeStatus encodeStatus={encodeStatus} />
			</View>
			<Text>Preview</Text>
		</SafeAreaView>
	);
}
