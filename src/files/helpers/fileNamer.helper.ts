export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: string) => void,
) => {
  if (!file) new callback(new Error('Make sure to upload a image file'), null);
  const ext = file.mimetype.split('/')[1];

  callback(null, file.originalname || `${Date.now()}.${ext}`);
};
