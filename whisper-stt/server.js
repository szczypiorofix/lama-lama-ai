import express from 'express';
import multer from 'multer';
import { spawn } from 'child_process';
import fs from 'fs';

const PORT = 8081;
const upload = multer({ dest: '/tmp' });

const app = express();

app.post('/stt', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'language', maxCount: 1 }]), (req, res) => {
  if (!req.files || !('file' in req.files) || !req.files['file'][0]) {
    return res.status(400).send('No file uploaded.');
  }

  const inputFile = req.files['file'][0];
  const inputPath = inputFile.path;
  const outputPath = `${inputPath}.txt`;
  const language = req.body.language;

  const whisperArgs = [
    inputPath,
    '--model', 'base',
    '--output_format', 'txt',
    '--output_dir', '/tmp',
  ];

  if (language) {
    whisperArgs.push('--language', language);
  }

  const whisper = spawn('whisper', whisperArgs);

  whisper.stderr.on('data', (data) => {
    console.error(`Whisper stderr: ${data}`);
  });

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
