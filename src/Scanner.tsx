import React, { useCallback, useMemo, useState } from 'react';
import useIsForeground from './hooks/useIsForeground';
import { Configuration } from './types';
import { useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { throttle } from 'throttle-debounce';

export interface ScannerProps {
	config: Configuration
	exit: () => void
}

const Scanner: React.FC<ScannerProps> = ({config, exit}) => {
	const isForeground = useIsForeground();
	const [lastScan, setLastScan] = useState<string>('')

	const onScan = useCallback((code: string) => {

	}, [config]);

	const onScanThrottled = useMemo(() => throttle(1000, onScan), [onScan])

	const device = useCameraDevice('back');
	const codeScanner = useCodeScanner({
		codeTypes: ['code-128', 'code-39', 'code-93', 'codabar', 'ean-13', 'ean-8', 'itf', 'itf-14', 'upc-e', 'upc-a', 'qr', 'pdf-417', 'aztec', 'data-matrix'],
		onCodeScanned: (codes) => {
			if(codes.length > 0) {
				if(codes[0].value){
					onScanThrottled(codes[0].value)
				}
			}
		}
	})
}

export default Scanner;