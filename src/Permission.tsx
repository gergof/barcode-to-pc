import React from 'react';
import { Button, Text, View } from 'react-native';
import { useCameraPermission } from 'react-native-vision-camera';

const Permission: React.FC = () => {
	const { requestPermission } = useCameraPermission();

	return (
		<View style={{ flex: 1, justifyContent: 'center' }}>
			<Text style={{ textAlign: 'center', marginBottom: 20 }}>
				To use this application you must grant camera permissions!
			</Text>
			<Button title="Grant" onPress={requestPermission} />
		</View>
	);
};

export default Permission;
