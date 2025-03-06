import React, { useState } from 'react';
import {View, Text} from 'react-native';
import Setup from './Setup';
import { Configuration } from './types';
import { useCameraPermission } from 'react-native-vision-camera';
import Permission from './Permission';

const Root: React.FC = () => {
	const {hasPermission} = useCameraPermission();
	const [config, setConfig] = useState<Configuration | null>(null);

	return (
		<View style={{flex: 1, backgroundColor: 'lightgray', padding: 30}}>
			{!hasPermission ? <Permission /> :
			!config ? <Setup setConfig={setConfig} /> : null
			}
		</View>
	)
}

export default Root