import { useState } from 'react';
import Button from '@/components/button/button';
import Input from '@/components/input/input';
import Logo from '@/components/logo/logo';

const GuestPage = () => {
	const [roomCode, setRoomCode] = useState('');

	const handleOnClick = () => {
		console.log(roomCode);
	};

	return (
		<>
			<Logo />
			<div>
				<Input
					label="Room Code"
					value={roomCode}
					onChange={(event) => setRoomCode(event.target.value)}
				/>
				<Button onClick={handleOnClick}>Next</Button>
			</div>
		</>
	);
};

export default GuestPage;
