import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import useIsForeground from './hooks/useIsForeground';
import { Configuration } from './types';
import {
	Camera,
	useCameraDevice,
	useCodeScanner,
} from 'react-native-vision-camera';
import { throttle } from 'throttle-debounce';
import { Button, LayoutChangeEvent, Text, View } from 'react-native';

export interface ScannerProps {
	config: Configuration;
	exit: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ config, exit }) => {
	const isForeground = useIsForeground();
	const [lastScan, setLastScan] = useState<string>('');

	const onScan = useCallback(
		(code: string) => {
			setLastScan(code);

			fetch(config.address, {
				method: 'POST',
				body: JSON.stringify({
					code,
				}),
			});
		},
		[config]
	);

	const onScanThrottled = useMemo(() => throttle(1000, onScan), [onScan]);

	const camera = useRef<Camera>(null);
	const device = useCameraDevice('back');
	const codeScanner = useCodeScanner({
		codeTypes: [
			'code-128',
			'code-39',
			'code-93',
			'codabar',
			'ean-13',
			'ean-8',
			'itf',
			'upc-e',
			'upc-a',
			'qr',
			'pdf-417',
			'aztec',
			'data-matrix',
		],
		onCodeScanned: codes => {
			if (codes.length > 0) {
				if (codes[0].value) {
					onScanThrottled(codes[0].value);
				}
			}
		},
	});

	const [previewSize, setPreviewSize] = useState<{
		width: number;
		height: number;
	} | null>(null);

	const onPreviewLayout = useCallback(
		(e: LayoutChangeEvent) => {
			setPreviewSize({
				width: e.nativeEvent.layout.width,
				height: e.nativeEvent.layout.height,
			});
		},
		[setPreviewSize]
	);

	useEffect(() => {
		if (device && device.supportsFocus && previewSize) {
			// auto focus to the center every 3 second
			let isFocusing = false;
			const interval = setInterval(() => {
				if (camera.current && !isFocusing) {
					isFocusing = true;
					camera.current
						.focus({
							x: previewSize.width / 2,
							y: previewSize.height / 2,
						})
						.finally(() => {
							isFocusing = false;
						});
				}
			}, 3 * 1000);

			return () => {
				clearInterval(interval);
			};
		}
	}, [camera, device, previewSize]);

	const rangefinderSize = useMemo(
		() => (previewSize ? previewSize.width - 80 : 200),
		[previewSize]
	);

	if (!device) {
		return <Text>Camera not available</Text>;
	}

	return (
		<View style={{ flex: 1 }}>
			<Text style={{ textAlign: 'center' }}>Last scanned:</Text>
			<Text style={{ textAlign: 'center', fontFamily: 'monospace' }}>
				{lastScan}
			</Text>
			<View style={{ flex: 1, marginTop: 30, marginBottom: 30 }}>
				<View
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						borderRadius: 20,
						overflow: 'hidden',
					}}>
					<Camera
						ref={camera}
						onLayout={onPreviewLayout}
						style={{ flex: 1 }}
						device={device}
						isActive={isForeground}
						codeScanner={codeScanner}
						resizeMode="cover"
					/>
				</View>
				<View
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					<View
						style={{
							width: rangefinderSize,
							height: rangefinderSize,
							borderWidth: 2,
							borderRadius: 10,
							borderColor: 'green',
						}}
					/>
				</View>
			</View>
			<Button onPress={exit} title="Go back" />
		</View>
	);
};

export default Scanner;
