import { useEffect, useRef, useState } from "react";
import { Mic, Type, Upload } from "lucide-react";
import { VoiceWaveform } from "@/v3/components/VoiceWaveform";
import type { V3InputMode } from "@/v3/hooks/useJourneyV3";

interface Props {
  value: string;
  inputMode: V3InputMode;
  showUpload: boolean;
  onChange: (value: string) => void;
  onInputModeChange: (mode: V3InputMode) => void;
  onShowUploadChange: (show: boolean) => void;
  onFiles?: (files: string[]) => void;
  disabled?: boolean;
}

export function VoiceFirstInput({
  value,
  inputMode,
  showUpload,
  onChange,
  onInputModeChange,
  onShowUploadChange,
  onFiles,
  disabled,
}: Props) {
  const [listening, setListening] = useState(false);
  const [simulated, setSimulated] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputMode !== "voice" || disabled) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSimulated(true);
      onInputModeChange("type");
      return;
    }

    setListening(true);
    setSimulated(false);
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join("");
      onChange(transcript);
    };
    recognition.onerror = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      setListening(false);
    };
  }, [inputMode, disabled, onChange, onInputModeChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const names = Array.from(e.target.files ?? []).map((f) => f.name);
    onFiles?.(names);
    if (names.length > 0) {
      onChange(`Uploaded: ${names.join(", ")}`);
    }
  };

  return (
    <div className="space-y-3">
      {inputMode === "voice" && (
        <div className="rounded-lg border border-me-amber/40 bg-me-amber/5 px-4 py-3 text-center">
          <p className="text-xs font-medium text-me-amber">
            {listening ? "Listening…" : "Voice mode"}
          </p>
          <VoiceWaveform active={listening} />
          {simulated && (
            <p className="mt-1 text-xs text-me-slate">
              Speech-to-text simulated in this browser — switch to type.
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onInputModeChange("voice")}
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs ${
            inputMode === "voice"
              ? "bg-me-amber text-white"
              : "border border-me-line text-me-slate"
          }`}
          data-testid="v3-mode-voice"
        >
          <Mic className="h-3.5 w-3.5" /> Voice
        </button>
        <button
          type="button"
          onClick={() => onInputModeChange("type")}
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs ${
            inputMode === "type"
              ? "bg-me-navy text-white"
              : "border border-me-line text-me-slate"
          }`}
          data-testid="v3-mode-type"
        >
          <Type className="h-3.5 w-3.5" /> Type instead
        </button>
        <button
          type="button"
          onClick={() => onShowUploadChange(!showUpload)}
          className="inline-flex items-center gap-1 text-xs text-me-navy underline"
          data-testid="v3-upload-toggle"
        >
          <Upload className="h-3.5 w-3.5" /> Upload a document instead
        </button>
      </div>

      {inputMode === "type" && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={3}
          placeholder="Type your answer…"
          className="w-full rounded-lg border border-me-line px-3 py-2 text-sm"
          data-testid="v3-type-input"
        />
      )}

      {showUpload && (
        <div
          className="rounded-lg border-2 border-dashed border-me-line bg-me-card p-6 text-center"
          data-testid="v3-upload-zone"
        >
          <p className="text-sm text-me-slate">Drag and drop or choose a file</p>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mt-2 rounded-lg bg-me-navy px-4 py-2 text-xs text-white"
          >
            Choose file
          </button>
          <input
            ref={fileRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {value && inputMode === "voice" && (
        <div className="rounded-lg bg-me-ice px-4 py-3 text-sm text-me-navy">
          {value}
        </div>
      )}
    </div>
  );
}
