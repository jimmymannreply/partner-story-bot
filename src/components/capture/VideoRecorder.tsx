import { useCallback, useEffect, useRef, useState } from "react";
import { Square, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoRecorderProps {
  onRecordingComplete: (blob: Blob, objectUrl: string) => void;
  disabled?: boolean;
}

export function VideoRecorder({ onRecordingComplete, disabled }: VideoRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => () => {
    stopStream();
    if (timerRef.current) clearInterval(timerRef.current);
  }, [stopStream]);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        await videoRef.current.play();
      }

      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
        ? "video/webm;codecs=vp9,opus"
        : MediaRecorder.isTypeSupported("video/webm")
          ? "video/webm"
          : "video/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        onRecordingComplete(blob, url);
        stopStream();
        if (videoRef.current) videoRef.current.srcObject = null;
      };
      mediaRecorderRef.current = recorder;
      recorder.start(1000);
      setRecording(true);
      setTimer(0);
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Camera access denied. Allow camera and microphone to record video."
      );
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTimer = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="space-y-2" data-testid="video-recorder">
      <div className="relative overflow-hidden rounded-dl border border-dl-border bg-black">
        {previewUrl ? (
          <video
            src={previewUrl}
            controls
            className="aspect-video w-full"
            data-testid="video-preview"
          />
        ) : (
          <video
            ref={videoRef}
            className="aspect-video w-full object-cover"
            playsInline
          />
        )}
        {recording && (
          <div className="absolute left-2 top-2 flex items-center gap-2 rounded bg-red-600 px-2 py-1 text-xs text-white">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            REC {formatTimer(timer)}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="button"
        onClick={recording ? stopRecording : startRecording}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 rounded-dl border px-4 py-2 text-sm",
          recording
            ? "border-red-300 bg-red-50 text-red-600"
            : "border-dl-border hover:bg-dl-page"
        )}
        data-testid="video-record-toggle"
      >
        {recording ? <Square size={16} /> : <Video size={16} />}
        {recording ? "Stop recording" : previewUrl ? "Record again" : "Start video recording"}
      </button>
    </div>
  );
}
