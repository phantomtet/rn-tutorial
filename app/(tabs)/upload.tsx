import api from "@/api/axios";
import { objectToFormData, uploadFileInChunksOptimized } from "@/utils";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import { Button, ProgressBar, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UploadPage() {
	const [progress, setProgress] = useState(0);
	const onUploadButtonClick = async () => {
		const result = await DocumentPicker.getDocumentAsync();
		if (result.canceled) return;
		const formData = objectToFormData({ file: result.assets[0] });
		api.post("/", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		console.log("assets", typeof result.assets[0]);
	};
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
		} catch (error) {
			console.log("err", error);
		}
		// console.log("hể", bytesToBase64(mergeChunks(mergeString)));
	};
	return (
		<SafeAreaView style={{ padding: 10 }}>
			<Button mode="contained" onPress={onUploadButtonClick}>
				Upload
			</Button>
			<Button onPress={handleUploadBigFile}>Calll api</Button>
			<Text>Progress bar</Text>
			<ProgressBar progress={progress} />
		</SafeAreaView>
	);
}
