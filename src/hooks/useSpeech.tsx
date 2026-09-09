import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface SpeechContextValue {
  muted: boolean;
  speaking: boolean;
  speak: (text: string) => void;
  stop: () => void;
  toggleMute: () => void;
}

const SpeechContext = createContext<SpeechContextValue | null>(null);

export function SpeechProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const getFemaleVoice = useCallback(() => {
    const voices = window.speechSynthesis?.getVoices() ?? [];
    const preferred = voices.find(
      (v) =>
        v.name.includes("Zira") ||
        v.name.includes("Samantha") ||
        v.name.includes("Female") ||
        (v.lang.startsWith("en") && v.name.toLowerCase().includes("female"))
    );
    return preferred ?? voices.find((v) => v.lang.startsWith("en")) ?? null;
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (muted || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = getFemaleVoice();
      if (voice) utterance.voice = voice;
      utterance.pitch = voice ? 1 : 1.15;
      utterance.rate = 0.95;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [muted, getFemaleVoice]
  );

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      if (!m) stop();
      return !m;
    });
  }, [stop]);

  useEffect(() => {
    const loadVoices = () => getFemaleVoice();
    window.speechSynthesis?.addEventListener("voiceschanged", loadVoices);
    return () =>
      window.speechSynthesis?.removeEventListener("voiceschanged", loadVoices);
  }, [getFemaleVoice]);

  return (
    <SpeechContext.Provider
      value={{ muted, speaking, speak, stop, toggleMute }}
    >
      {children}
    </SpeechContext.Provider>
  );
}

export function useSpeech() {
  const ctx = useContext(SpeechContext);
  if (!ctx) throw new Error("useSpeech must be used within SpeechProvider");
  return ctx;
}
