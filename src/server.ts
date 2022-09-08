import 'dotenv/config';
import express from 'express';
import { Storage } from '@google-cloud/storage';
import multer from 'multer'

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.post('/', multer().single('file'), async (req, res) => {
  const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT_ID
  });

  const bucket = storage.bucket(process.env.GCLOUD_BUCKET_NAME);

  const { originalname, buffer } = req.file as any;

  const file = bucket.file(`${new Date().getTime()}-${originalname}`);

  await file.save(buffer),
  
  await file.makePublic()

  const url = file.publicUrl()

  return res.json({ url });

})

app.listen(3333, () => console.log('server running'))