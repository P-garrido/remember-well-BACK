import multer from "multer";
import { v4 as uuidv4 } from 'uuid';


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/public');
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    const uniqueFilename = `${uuidv4()}`;
    cb(null, `${uniqueFilename}.${ext}`);
  }
});


export const upload = multer({ storage });