import {diskStorage} from 'multer';

import { v4 as uuidv4 } from 'uuid';

const path = require('path');

export const storage = diskStorage({
		destination:'./dist/public/img',
		filename: (req, file,cb)=>{
			const filename: string = path.parse(file.originalname)
			.name
			.replace(/\s/g,'') + uuidv4();
			
			const extension: string = path.parse(file.originalname).ext;
			cb(null,`${filename}${extension}`);
		}
	});