import { storage } from '@/utils/db/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { IncomingForm } from 'formidable';
import fs from 'fs';

// Disable the default body parser to handle the incoming `FormData` manually
export const config = {
	api: {
		bodyParser: false,
	},
};

// api/storage
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'GET') {
		try {
			const { fileId } = req.query;

			if (!fileId || typeof fileId !== 'string') {
				return res
					.status(400)
					.json({ error: 'fileId query parameter is required' });
			}

			const fileRef = ref(storage, `images/${fileId}`);

			const downloadURL = await getDownloadURL(fileRef);

			res.status(200).json({ downloadURL });
		} catch (e: any) {
			console.error('Error fetching file URL:', e.message);
			res.status(500).json({
				error: e.message || 'Failed to retrieve file URL',
			});
		}
	}
	if (req.method === 'POST') {
		const form = new IncomingForm();

		form.parse(req, async (err, fields, files) => {
			if (err) {
				return res
					.status(500)
					.json({ error: 'Failed to parse form data' });
			}

			try {
				const [fileId] = fields.fileId as unknown as string[];
				const [file] = files.file as unknown as formidable.File[];

				if (!fileId || !file) {
					return res
						.status(400)
						.json({ error: 'fileId or file not provided' });
				}

				const storageRef = ref(storage, `images/${fileId}`);

				const fileBuffer = await fs.promises.readFile(file.filepath);
				const { metadata } = await uploadBytes(storageRef, fileBuffer, {
					contentType: file.mimetype || undefined,
				});

				const fileURL = `https://storage.googleapis.com/${metadata.bucket}/${metadata.fullPath}`;

				return res
					.status(200)
					.json({ message: 'Uploaded Successfully', fileURL });
			} catch (e: any) {
				console.error('Upload error:', e.message);
				return res
					.status(500)
					.json({ error: e.message || 'Failed to upload file' });
			}
		});
	}
};

export default handler;
