import express from 'express';
import multer from 'multer';
import { spawn } from 'child_process';
import fs from 'fs';

const PORT = 8081;
const upload = multer({ dest: '/tmp' });

const app = express();

app.post('/stt', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const inputPath = req.file.path;
  const outputPath = `${inputPath}.txt`;

  const whisper = spawn('whisper', [inputPath, '--model', 'base', '--output_format', 'txt', '--output_dir', '/tmp']);

  whisper.on('close', (code) => {
    if (code !== 0) {
      fs.unlinkSync(inputPath);
      return res.status(500).send('Whisper failed with code ' + code);
    }
    fs.readFile(outputPath, 'utf8', (err, data) => {
      fs.unlinkSync(inputPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      if (err) {
        return res.status(500).send('Failed to read transcription');
      }
      res.json({ text: data.trim() });
    });
  });
});

app.listen(PORT, () => console.log(`Whisper STT API running on port ${PORT}`));
