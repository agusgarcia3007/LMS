import { $ } from "bun";
import { groq } from "./groq";
import { AI_MODELS } from "./models";
import { logger } from "../logger";

export async function transcribeVideo(videoUrl: string): Promise<string> {
  const start = Date.now();

  logger.info("Starting FFmpeg audio extraction");

  const result =
    await $`ffmpeg -threads 0 -analyzeduration 0 -probesize 32768 -i ${videoUrl} -vn -ac 1 -ar 16000 -af "silenceremove=1:0:-50dB:1:1:-50dB,atempo=2.0" -f mp3 -b:a 32k -`.quiet();

  const ffmpegTime = Date.now() - start;
  logger.info("FFmpeg extraction completed", { ffmpegTime: `${ffmpegTime}ms` });

  const audioFile = new File([new Uint8Array(result.stdout)], "audio.mp3", {
    type: "audio/mpeg",
  });

  logger.info("Starting Groq Whisper transcription", {
    audioSize: `${(audioFile.size / 1024).toFixed(1)}KB`,
  });

  const whisperStart = Date.now();
  const transcription = await groq.audio.transcriptions.create({
    file: audioFile,
    model: AI_MODELS.TRANSCRIPTION,
  });
  const whisperTime = Date.now() - whisperStart;

  logger.info("Groq Whisper transcription completed", {
    whisperTime: `${whisperTime}ms`,
    transcriptLength: transcription.text.length,
  });

  return transcription.text;
}
