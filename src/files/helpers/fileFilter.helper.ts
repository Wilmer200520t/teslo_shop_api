export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file) return callback(new Error('No file provided'), false);
  const fileType = file.mimetype.split('/')[1];

  const allowedTypes = ['jpeg', 'jpg', 'png', 'gif'];

  if (allowedTypes.includes(fileType)) return callback(null, true);

  return callback(new Error('File type not allowed'), false);
};
