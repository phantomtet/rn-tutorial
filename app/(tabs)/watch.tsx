import StyledPlayerView from "@/components/styled-components/player-view";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@react-navigation/elements";
import {
	ReadyEvent,
	SourceType,
	usePlayer,
	UserInterfaceType,
} from "bitmovin-player-react-native";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";

const androidSourceUrl =
	"https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd";
const iosSourceUrl =
	"https://bitmovin-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8";

export default function PlayerSample() {
	const player = usePlayer({
		styleConfig: {
			userInterfaceType: UserInterfaceType.Bitmovin,
			playerUiCss:
				"https://gist.githubusercontent.com/eirikbakke/1059266/raw/d81dba46c76169c2b253de0baed790677883c221/gistfile1.css",
		},
	});

	const onReady = (event: ReadyEvent) => {
		console.log("ready");
		// player.play();
	};
	useEffect(() => {
		player.load({
			url: androidSourceUrl,
			type: SourceType.DASH,
		});
	}, [player]);
	return (
		<ThemedView style={styles.flex1}>
			<StyledPlayerView
				config={{ uiConfig: {} }}
				style={styles.flex1}
				player={player}
				onReady={onReady}
			/>
			<Button>aab</Button>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	flex1: {
		flex: 1,
	},
});
