import React, { useCallback, useState } from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import { Configuration } from './types';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import useIsForeground from './hooks/useIsForeground';

export interface SetupParams {
	setConfig: React.Dispatch<React.SetStateAction<Configuration | null>>	
}

const Setup: React.FC<SetupParams> = ({setConfig}) => {
	const isForeground = useIsForeground()

	const [serverAddress, setServerAddress] = useState<string>('')
	const onSubmit = useCallback(() => {
		setConfig({
			address: serverAddress
		})
	}, [setConfig, serverAddress])
	
	const device = useCameraDevice('back')
	const codeScanner = useCodeScanner({
		codeTypes: ['qr'],
		onCodeScanned: codes => {
			if(codes.length > 0) {
				if(codes[0].value){
					setConfig({
						address: codes[0].value
					})
				}
			}
		}
	})

	return (
		<View style={{flex: 1}}>
			<Text style={{fontSize: 24, textAlign: 'center', marginBottom: 20}}>Barcode To PC</Text>
			<Text style={{textAlign: 'center'}}>Please connect to the PC host software to start scanning.</Text>
			<Text style={{textAlign: 'center'}}>You can download it from:</Text>
			<Text style={{textAlign: 'center'}}>https://github.com/gergof/barcode-to-pc</Text>
			<View style={{height: 50}} />
			<Text>Server Address:</Text>
			<TextInput style={{borderWidth: 1, borderRadius: 4, padding: 10, marginBottom: 8}} value={serverAddress} onChangeText={setServerAddress} placeholder="http://192.168.0.100:4747" />
			<Button onPress={onSubmit} title="Submit" />
			<View style={{height: 50}} />
			<Text style={{marginBottom: 8}}>Or scan QR code shown in terminal:</Text>
			{device ?
				<View style={{alignItems: 'center', justifyContent: 'center'}}>
					<Camera style={{width: 250, height: 250}} device={device} isActive={isForeground} codeScanner={codeScanner} />
				</View>
			 : null}
		</View>
	)
}

export default Setup