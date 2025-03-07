import React, { useCallback, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import Setup from './Setup';
import { Configuration } from './types';
import { useCameraPermission } from 'react-native-vision-camera';
import Permission from './Permission';
import Scanner from './Scanner';

const Root: React.FC = () => {
	const { hasPermission } = useCameraPermission();
	const [config, setConfig] = useState<Configuration | null>(null);

	const onExit = useCallback(() => {
		setConfig(null);
	}, [setConfig]);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'lightgray' }}>
			<View style={{ flex: 1, padding: 30 }}>
				{!hasPermission ? (
					<Permission />
				) : !config ? (
					<Setup setConfig={setConfig} />
				) : (
					<Scanner config={config} exit={onExit} />
				)}
			</View>
		</SafeAreaView>
	);
};

export default Root;
