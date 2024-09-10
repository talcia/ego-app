import Button from '@/components/button/button';
import Input from '@/components/input/input';
import useAuth from '@/hooks/use-auth';
import { auth } from '@/utils/db/firebase';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { updateProfile } from 'firebase/auth';
import PlayerAvatar from '@/components/question-page/player-avatar';
import ProfileLayout from './layout';
import { NextPageWithLayout } from '../_app';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

const Profile: NextPageWithLayout = () => {
	useAuth();
	const [user] = useAuthState(auth);
	const [userName, setUserName] = useState('');
	const [file, setFile] = useState<File>();
	const [fileURL, setFileURL] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	useEffect(() => {
		if (user && user.displayName) {
			setUserName(user.displayName);
		} else if (user && user.email) {
			setUserName(user.email);
		}
	}, [user]);

	const onSaveClick = async () => {
		if (!file || !user) {
			return;
		}

		const formData = new FormData();
		formData.append('file', file);
		formData.append('fileId', user.uid);

		const response = await fetch('/api/storage', {
			method: 'POST',
			body: formData,
		});

		if (response.status === 200) {
			updateProfile(user!, {
				displayName: userName,
			});
			router.replace('/profile');
		}
	};

	const onFileUpload = ({
		target: { files },
	}: ChangeEvent<HTMLInputElement>): void => {
		if (files?.length) {
			const fileUrl = URL.createObjectURL(files[0]);
			setFile(files[0]);
			setFileURL(fileUrl);
		}
	};

	if (!user) {
		return;
	}

	return (
		<div className="flex flex-col">
			<div className="relative my-3 w-[150px] h-[150px] m-auto">
				{fileURL ? (
					<Image
						src={fileURL}
						alt="user image"
						className="rounded-full"
						layout="fill"
					/>
				) : (
					<PlayerAvatar size={150} playerId={user.uid} />
				)}
				<label
					htmlFor="file-upload"
					className="absolute bottom-[-20px] right-[-20px] text-customWhite bg-customBlack p-2 rounded-xl border cursor-pointer"
				>
					Edit
					<FontAwesomeIcon icon={faEdit} className="ml-2" />
				</label>
				<input
					type="file"
					id="file-upload"
					accept="image/png, image/jpg"
					onChange={onFileUpload}
					className="hidden"
				/>
			</div>
			<div className="flex justify-center items-center my-4">
				<Input
					ref={inputRef}
					value={userName}
					onChange={({ target: { value } }) => setUserName(value)}
				/>
			</div>
			<Button onClick={onSaveClick}>Save</Button>
		</div>
	);
};

Profile.getLayout = (page: React.ReactElement) => (
	<ProfileLayout>{page}</ProfileLayout>
);

export default Profile;
