import { useRef, useState } from "react";
import { Mic, MicOff, Paperclip, Square } from "lucide-react";
import { cn, obfuscateFilename } from "@/lib/utils";
import { VideoRecorder } from "./VideoRecorder";

interface InputRowProps {
  value: string;
  onChange: (value: string) => void;
  onFiles?: (files: string[]) => void;
  onVideoRecorded?: (objectUrl: string) => void;
  placeholder?: string;
  disabled?: boolean;
  showVideo?: boolean;
}

export function InputRow({
  value,
  onChange,
  onFiles,
  onVideoRecorded,
  placeholder = "Type your answer or use the record button...",
  disabled,
  showVideo = true,
}: InputRowProps) {
  const [audioRecording, setAudioRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [piiChecked, setPiiChecked] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startAudioRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (e: SpeechRecognitionEvent) => {
        const transcript = Array.from(e.results)
          .map((r) => r[0].transcript)
          .join("");
        onChange(transcript);
      };
      recognition.start();
      recognitionRef.current = recognition;
    }
    setAudioRecording(true);
    setTimer(0);
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
  };

  const stopAudioRecording = () => {
    recognitionRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setAudioRecording(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const names = files.map((f) =>
      piiChecked ? obfuscateFilename(f.name) : f.name
    );
    const updated = [...uploadedFiles, ...names];
    setUploadedFiles(updated);
    onFiles?.(updated);
  };

  const formatTimer = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="mt-3 space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 rounded-dl border border-dl-border px-3 py-2 text-sm focus:border-dl-brand focus:outline-none focus:ring-1 focus:ring-dl-brand"
          data-testid="input-row-text"
        />
        <button
          type="button"
          onClick={audioRecording ? stopAudioRecording : startAudioRecording}
          disabled={disabled}
          className={cn(
            "rounded-dl border px-3 py-2",
            audioRecording
              ? "border-red-300 bg-red-50 text-red-600"
              : "border-dl-border hover:bg-dl-page"
          )}
          aria-label={audioRecording ? "Stop recording" : "Start audio recording"}
          data-testid="mic-button"
        >
          {audioRecording ? <Square size={18} /> : <Mic size={18} />}
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={disabled}
          className="rounded-dl border border-dl-border px-3 py-2 hover:bg-dl-page"
          aria-label="Upload document"
          data-testid="upload-button"
        >
          <Paperclip size={18} />
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          data-testid="file-input"
        />
      </div>

      {audioRecording && (
        <div className="flex items-center gap-2 text-xs text-dl-text-secondary">
          <MicOff size={14} className="animate-pulse text-red-500" />
          Recording audio — {formatTimer(timer)}
        </div>
      )}

      {showVideo && onVideoRecorded && (
        <VideoRecorder
          disabled={disabled}
          onRecordingComplete={(_blob, url) => onVideoRecorded(url)}
        />
      )}

      <label className="flex items-center gap-2 text-xs text-dl-text-secondary">
        <input
          type="checkbox"
          checked={piiChecked}
          onChange={(e) => setPiiChecked(e.target.checked)}
          data-testid="pii-checkbox"
        />
        My documents contain PII — obfuscate filenames automatically
      </label>
      {uploadedFiles.length > 0 && (
        <ul className="text-xs text-dl-text-secondary">
          {uploadedFiles.map((f) => (
            <li key={f}>📎 {f}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
