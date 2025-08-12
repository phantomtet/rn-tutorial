import {
	PlayerView,
	ReadyEvent,
	ScalingMode,
	SourceType,
	usePlayer,
} from "bitmovin-player-react-native";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";

interface IProps {
	source: string;
	shouldPause?: boolean;
	shouldPlay?: boolean;
	index?: number;
}

export default function Player(props: IProps) {
	const navigation = useNavigation();
	const [isFullscreen, setIsFullScreen] = useState(false);
	const [isReady, setIsReady] = useState(false);
	const player = usePlayer({
		styleConfig: {
			supplementalPlayerUiCss:
				"https://storage.googleapis.com/bitmovin-player-cdn-origin/player/ui/ui-customized-sample.css",
		},
	});

	const onReady = (event: ReadyEvent) => {
		// console.log("ready");
		// player.play();
		setIsReady(true);
	};
	useEffect(() => {
		player.load({
			url: props.source,
			type: SourceType.DASH,
		});
		return () => {
			console.log("destroy player index", props.index);
			player.destroy();
		};
	}, [player, props.source]);
	// useFocusEffect(
	// 	useCallback(() => {
	// 		console.log("player resume due to focus", props.index);
	// 		player.play();
	// 		return () => {
	// 			player.pause();
	// 			console.log("player pause due to unfocus", props.index);
	// 		};
	// 	}, [props.index, player]),
	// );
	useEffect(() => {
		if (props.shouldPause) player?.pause();
	}, [props.shouldPause, isReady, player]);
	useEffect(() => {
		if (props.shouldPlay) player?.play();
	}, [props.shouldPlay, isReady, player]);
	return (
		<PlayerView
			fullscreenHandler={{
				enterFullscreen: () => {
					navigation.setOptions({
						tabBarStyle: { display: "none" },
					});
					setIsFullScreen(true);
				},
				exitFullscreen: () => {
					navigation.setOptions({
						tabBarStyle: { display: "" },
					});
					setIsFullScreen(false);
				},
				isFullscreenActive: isFullscreen,
			}}
			style={isFullscreen ? styles.playerFullscreen : styles.player}
			player={player}
			onReady={onReady}
		/>
	);
}

const styles = StyleSheet.create({
	player: {
		flex: 1,
		backgroundColor: "black",
	},
	playerFullscreen: {
		position: "absolute",
		zIndex: 1,
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		backgroundColor: "black",
	},
});
