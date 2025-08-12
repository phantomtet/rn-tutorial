import Player from "@/components/bitmovin-player";
import React, { useEffect, useState } from "react";
import {
	FlatList,
	NativeScrollEvent,
	NativeSyntheticEvent,
	StatusBar,
	StyleSheet,
	Text,
	useWindowDimensions,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const androidSourceUrl =
	"https://danknoa3lht0h.cloudfront.net/06ca8a5e-4d19-4220-8428-e3ee916dabe6/manifest.mpd";
const iosSourceUrl =
	"https://bitmovin-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8";

export default function WatchPage() {
	const dimension = useWindowDimensions();

	const [data, setData] = useState<any[]>([]);
	const [cursor, setCursor] = useState<number>(0);
	const handleMomentumScrollEnd = (
		event: NativeSyntheticEvent<NativeScrollEvent>,
	) => {
		const offsetY = event.nativeEvent.contentOffset.y;
		const currentIndex = Math.round(offsetY / dimension.height);
		setCursor(currentIndex);
	};
	const fetchMoreOlderVideo = async () => {
		console.log("fetch more older videos");
		setData((prev) => [
			...prev,
			data.length + 0,
			data.length + 1,
			data.length + 2,
		]);
	};

	useEffect(() => {
		fetchMoreOlderVideo();
	}, []);
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Text>
				data length: {data.length}, cursor: {cursor}
			</Text>
			<FlatList
				style={{ flex: 1 }}
				windowSize={3}
				data={data}
				onMomentumScrollEnd={handleMomentumScrollEnd}
				onEndReached={fetchMoreOlderVideo}
				onEndReachedThreshold={0.5}
				pagingEnabled
				snapToAlignment="start"
				initialNumToRender={2}
				showsVerticalScrollIndicator={false}
				renderItem={(e) => (
					<View style={{ height: dimension.height - 140 }}>
						<Player
							source={androidSourceUrl}
							shouldPause={e.index !== cursor}
							shouldPlay={e.index === cursor}
							index={e.index}
						/>
					</View>
				)}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "white",
		padding: 20,
		flexDirection: "column",
	},
});
