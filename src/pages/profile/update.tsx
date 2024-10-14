import Button from '@/components/button/button';
import Input from '@/components/input/input';
import { auth } from '@/utils/db/firebase';
import { ChangeEvent, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { updateProfile } from 'firebase/auth';
import PlayerAvatar from '@/components/player-avatar/player-avatar';
import ProfileLayout from './layout';
import { NextPageWithLayout } from '../_app';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const Profile: NextPageWithLayout = () => {
	const [userName, setUserName] = useState('');
	const [file, setFile] = useState<File>();
	const [fileURL, setFileURL] = useState('');
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [authUser] = useAuthState(auth);
	const session = useSession();
	const { data } = session;

	useEffect(() => {
		if (!data) {
			return;
		}
		const { user } = data;
		if (user && user.name) {
			setUserName(user.name);
		} else if (user && user.email) {
			setUserName(user.email);
		}
	}, [data]);

	const onSaveClick = async () => {
		setIsLoading(true);
		if (!file) {
			if (data && auth.currentUser && userName !== data.user.name) {
				await updateProfile(auth.currentUser!, {
					displayName: userName,
				});
				session.update({ name: userName });

				setUserName('');
				router.replace('/profile');
			}
			setIsLoading(false);
			return;
		}

		const formData = new FormData();
		formData.append('file', file);
		formData.append('fileId', data?.user.id!);

		const response = await fetch('/api/storage', {
			method: 'POST',
			body: formData,
		});

		if (data && authUser && response.status === 200) {
			await updateProfile(authUser, {
				displayName: userName,
			});
			session.update({ name: userName });
			setUserName('');
			router.replace('/profile');
		}
		setIsLoading(false);
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
					<PlayerAvatar size={150} playerId={data?.user.id!} />
				)}
				<label
					htmlFor="file-upload"
					className="absolute bottom-[-20px] right-[-20px] text-customWhite bg-customBlack p-2 rounded-xl border cursor-pointer"
				>
					Edit
					<FontAwesomeIcon
						icon={faEdit}
						className="ml-2 cursor-pointer"
					/>
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
					label="Name"
					value={userName}
					onChange={({ target: { value } }) => setUserName(value)}
				/>
			</div>
			<Button onClick={onSaveClick} isLoading={isLoading}>
				Save
			</Button>
		</div>
	);
};

Profile.getLayout = (page: React.ReactElement) => (
	<ProfileLayout>{page}</ProfileLayout>
);

export default Profile;
