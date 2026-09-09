import { useRef, useState } from "react";
import { Mic, MicOff, Paperclip, Video, Square } from "lucide-react";
import { cn, obfuscateFilename } from "@/lib/utils";

interface InputRowProps {
  value: string;
  onChange: (value: string) => void;
  onFiles?: (files: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function InputRow({
  value,
  onChange,
  onFiles,
  placeholder = "Type your answer or use the record button...",
  disabled,
}: InputRowProps) {
  const [recording, setRecording] = useState(false);
  const [videoMode, setVideoMode] = useState(false);
  const [timer, setTimer] = useState(0);
  const [piiChecked, setPiiChecked] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startRecording = () => {
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
    setRecording(true);
    setTimer(0);
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setRecording(false);
    setVideoMode(false);
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
    <div className="mt-3 space-y-2">
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
          onClick={recording ? stopRecording : startRecording}
          disabled={disabled}
          className={cn(
            "rounded-dl border px-3 py-2",
            recording
              ? "border-red-300 bg-red-50 text-red-600"
              : "border-dl-border hover:bg-dl-page"
          )}
          aria-label={recording ? "Stop recording" : "Start recording"}
          data-testid="mic-button"
        >
          {recording ? <Square size={18} /> : <Mic size={18} />}
        </button>
        <button
          type="button"
          onClick={() => {
            if (recording && videoMode) {
              stopRecording();
            } else {
              setVideoMode(true);
              startRecording();
            }
          }}
          disabled={disabled}
          className={cn(
            "rounded-dl border px-3 py-2",
            videoMode && recording
              ? "border-red-300 bg-red-50 text-red-600"
              : "border-dl-border hover:bg-dl-page"
          )}
          aria-label="Video record"
          data-testid="video-button"
        >
          <Video size={18} />
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
      {recording && (
        <div className="flex items-center gap-2 text-xs text-dl-text-secondary">
          <MicOff size={14} className="animate-pulse text-red-500" />
          {videoMode ? "Recording video" : "Recording audio"} — {formatTimer(timer)}
          <div className="flex h-4 flex-1 items-end gap-0.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-dl-brand animate-pulse"
                style={{
                  height: `${8 + Math.random() * 16}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
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
