import { Zhi_Mang_Xing } from 'next/font/google';

const zhiMangXing = Zhi_Mang_Xing({ weight: '400', subsets: ['latin'] });

const RoomNotExist = () => {
	return (
		<div className="text-customWhite py-10">
			<p
				className={`text-9xl my-10 text-center ${
					zhiMangXing.className
				} text-customRed ${'cursor-pointer'} `}
			>
				404
			</p>
			<p>{`This room code doesn't match any existing room`}</p>
		</div>
	);
};

export default RoomNotExist;
