import { useState, useEffect } from 'react';
import { AppState } from 'react-native';

const useIsForeground = (): boolean => {
	const [isForeground, setIsForeground] = useState(true);

	useEffect(() => {
		const listener = AppState.addEventListener('change', state => {
			setIsForeground(state == 'active');
		});

		return () => listener.remove();
	}, [setIsForeground]);

	return isForeground;
};

export default useIsForeground;
