import express from "express";
const { spawn } = await import('child_process');
import fs from "fs";

const PORT = 8080;

const app = express();
app.use(express.json());

app.post("/tts", (req, res) => {
    const text = req.body.text;

    console.log("Body, text:", text);

    if (!text) return res.status(400).send("Missing 'text' field.");

    const output = "/tmp/output.wav";

    const piper = spawn("piper", [
        "--model", "model/pl_PL-gosia-medium.onnx",
        "--output_file", output
    ]);

    piper.stdin.write(text);
    piper.stdin.end();

    piper.on("close", (code) => {
        if (code !== 0) {
            return res.status(500).send("An error occurred on Piper: " + code);
        }

        res.set("Content-Type", "audio/wav");
        fs.createReadStream(output).pipe(res);
    });
});

app.listen(PORT, () => console.log(`Piper TTS API running on port ${PORT}`));
