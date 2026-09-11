import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { interviewStepsV3 } from "@/v3/data/interviewStepsV3";

const STORAGE_KEY = "partner-story-bot-v3-draft";

export type V3Screen = "landing" | "contact" | "interview" | "wrap-up";
export type V3InputMode = "voice" | "type";

export interface V3Response {
  value: string;
  files?: string[];
}

export interface V3Options {
  draftAssist: boolean;
  rubricGrading: boolean;
}

export interface V3Addons {
  piiRedaction: boolean;
  activeReviewRouting: boolean;
  customerApprovalForm: boolean;
  adaptiveQuestions: boolean;
  loginAutoPull: boolean;
  customerContentCapture: boolean;
}

export interface V3State {
  screen: V3Screen;
  microsoftContact: string;
  interviewStep: number;
  responses: Record<string, V3Response>;
  inputMode: V3InputMode;
  showUpload: boolean;
  options: V3Options;
  addons: V3Addons;
  confirmed: boolean;
}

const initialAddons: V3Addons = {
  piiRedaction: false,
  activeReviewRouting: false,
  customerApprovalForm: false,
  adaptiveQuestions: false,
  loginAutoPull: false,
  customerContentCapture: false,
};

const initialState: V3State = {
  screen: "landing",
  microsoftContact: "",
  interviewStep: 0,
  responses: {},
  inputMode: "voice",
  showUpload: false,
  options: { draftAssist: false, rubricGrading: false },
  addons: initialAddons,
  confirmed: false,
};

interface V3ContextValue {
  state: V3State;
  steps: typeof interviewStepsV3;
  startJourney: () => void;
  setMicrosoftContact: (value: string) => void;
  continueFromContact: () => void;
  setResponse: (id: string, response: V3Response) => void;
  setInputMode: (mode: V3InputMode) => void;
  setShowUpload: (show: boolean) => void;
  advanceInterview: () => void;
  setOption: (key: keyof V3Options, value: boolean) => void;
  setAddon: (key: keyof V3Addons, value: boolean) => void;
  confirmWrapUp: () => void;
  resetJourney: () => void;
  getWrapUpSummary: () => string;
}

const V3Context = createContext<V3ContextValue | null>(null);

export function JourneyV3Provider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<V3State>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as V3State;
    } catch {
      /* ignore */
    }
    return initialState;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, 400);
    return () => clearTimeout(timer);
  }, [state]);

  const startJourney = useCallback(() => {
    setState((prev) => ({ ...prev, screen: "contact" }));
  }, []);

  const setMicrosoftContact = useCallback((value: string) => {
    setState((prev) => ({ ...prev, microsoftContact: value }));
  }, []);

  const continueFromContact = useCallback(() => {
    setState((prev) => ({
      ...prev,
      screen: "interview",
      responses: {
        ...prev.responses,
        "ms-contact": { value: prev.microsoftContact },
      },
    }));
  }, []);

  const setResponse = useCallback((id: string, response: V3Response) => {
    setState((prev) => ({
      ...prev,
      responses: { ...prev.responses, [id]: response },
    }));
  }, []);

  const setInputMode = useCallback((mode: V3InputMode) => {
    setState((prev) => ({ ...prev, inputMode: mode }));
  }, []);

  const setShowUpload = useCallback((show: boolean) => {
    setState((prev) => ({ ...prev, showUpload: show }));
  }, []);

  const advanceInterview = useCallback(() => {
    setState((prev) => {
      const nextStep = prev.interviewStep + 1;
      if (nextStep >= interviewStepsV3.length) {
        return { ...prev, screen: "wrap-up", interviewStep: nextStep };
      }
      return { ...prev, interviewStep: nextStep, showUpload: false };
    });
  }, []);

  const setOption = useCallback((key: keyof V3Options, value: boolean) => {
    setState((prev) => ({
      ...prev,
      options: { ...prev.options, [key]: value },
    }));
  }, []);

  const setAddon = useCallback((key: keyof V3Addons, value: boolean) => {
    setState((prev) => ({
      ...prev,
      addons: { ...prev.addons, [key]: value },
    }));
  }, []);

  const getWrapUpSummary = useCallback(() => {
    const solution =
      state.responses.solution?.value ||
      state.responses["about-you"]?.value ||
      "your solution";
    const customer =
      state.responses.customer?.value?.split(/[,.]/)[0]?.trim() || "your customer";
    return `Got it — a story about ${solution} with ${customer}, sponsored by ${state.microsoftContact || "your Microsoft contact"}.`;
  }, [state.responses, state.microsoftContact]);

  const confirmWrapUp = useCallback(() => {
    setState((prev) => ({ ...prev, confirmed: true }));
  }, []);

  const resetJourney = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
  }, []);

  const value = useMemo(
    () => ({
      state,
      steps: interviewStepsV3,
      startJourney,
      setMicrosoftContact,
      continueFromContact,
      setResponse,
      setInputMode,
      setShowUpload,
      advanceInterview,
      setOption,
      setAddon,
      confirmWrapUp,
      getWrapUpSummary,
      resetJourney,
    }),
    [
      state,
      startJourney,
      setMicrosoftContact,
      continueFromContact,
      setResponse,
      setInputMode,
      setShowUpload,
      advanceInterview,
      setOption,
      setAddon,
      confirmWrapUp,
      getWrapUpSummary,
      resetJourney,
    ]
  );

  return <V3Context.Provider value={value}>{children}</V3Context.Provider>;
}

export function useJourneyV3() {
  const ctx = useContext(V3Context);
  if (!ctx) throw new Error("useJourneyV3 must be used within JourneyV3Provider");
  return ctx;
}
