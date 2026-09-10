import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { mockPartnerProfile } from "@/data/mockPartnerData";
import type { CustomerApprovalState } from "@/data/mockPartnerData";
import { journeyStagesV2 } from "@/v2/data/journeyStagesV2";

const STORAGE_KEY = "partner-story-bot-v2-draft";

export interface V2Response {
  value: string;
  files?: string[];
  videoUrl?: string;
}

export interface V2Addons {
  loginAutoPull: boolean;
  adaptiveQuestions: boolean;
  ratingRubric: boolean;
  customerCapture: boolean;
}

export interface V2State {
  activeStageId: string;
  completedActions: Set<string>;
  responses: Record<string, V2Response>;
  manualEntry: Record<string, string>;
  manualEntryStep: number;
  customerApproval: CustomerApprovalState;
  affidavitAccepted: boolean;
  attested: boolean;
  signatureName: string;
  submitted: boolean;
  showDemoBanner: boolean;
  sidePanelOpen: boolean;
  draftRevealed: boolean;
  signedIn: boolean;
  customerLinkSent: boolean;
  customerLinkReceived: boolean;
  addons: V2Addons;
}

const initialAddons: V2Addons = {
  loginAutoPull: false,
  adaptiveQuestions: false,
  ratingRubric: false,
  customerCapture: false,
};

const initialState: V2State = {
  activeStageId: "setup",
  completedActions: new Set(),
  responses: {},
  manualEntry: {},
  manualEntryStep: 0,
  customerApproval: "Unknown",
  affidavitAccepted: false,
  attested: false,
  signatureName: "",
  submitted: false,
  showDemoBanner: true,
  sidePanelOpen: false,
  draftRevealed: false,
  signedIn: false,
  customerLinkSent: false,
  customerLinkReceived: false,
  addons: initialAddons,
};

type Persisted = Omit<V2State, "completedActions"> & { completedActions: string[] };

function serialize(state: V2State): Persisted {
  return { ...state, completedActions: Array.from(state.completedActions) };
}

function deserialize(data: Persisted): V2State {
  return { ...data, completedActions: new Set(data.completedActions) };
}

interface V2ContextValue {
  state: V2State;
  stages: typeof journeyStagesV2;
  profile: typeof mockPartnerProfile;
  completeAction: (id: string, response?: V2Response) => void;
  setActiveStage: (id: string) => void;
  setResponse: (id: string, response: V2Response) => void;
  setManualEntryField: (key: string, value: string) => void;
  advanceManualEntry: () => void;
  setCustomerApproval: (s: CustomerApprovalState) => void;
  setAffidavitAccepted: (b: boolean) => void;
  setAttested: (b: boolean) => void;
  setSignatureName: (s: string) => void;
  submit: () => void;
  dismissBanner: () => void;
  toggleSidePanel: () => void;
  revealDraft: () => void;
  signInMock: () => void;
  sendCustomerLink: () => void;
  simulateCustomerResponse: () => void;
  setAddon: (key: keyof V2Addons, value: boolean) => void;
  resetJourney: () => void;
  getStageProgress: (stageId: string) => { completed: number; total: number };
  isActionComplete: (id: string) => boolean;
  isActionActive: (stageId: string, actionId: string) => boolean;
}

const V2Context = createContext<V2ContextValue | null>(null);

export function JourneyV2Provider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<V2State>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return deserialize(JSON.parse(raw) as Persisted);
    } catch {
      /* ignore */
    }
    return initialState;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialize(state)));
    }, 400);
    return () => clearTimeout(timer);
  }, [state]);

  const completeAction = useCallback((id: string, response?: V2Response) => {
    setState((prev) => {
      const completed = new Set(prev.completedActions);
      completed.add(id);
      const responses = response
        ? { ...prev.responses, [id]: response }
        : prev.responses;
      const stage = journeyStagesV2.find((s) => s.actions.some((a) => a.id === id));
      const stageActions = stage?.actions ?? [];
      const allDone = stageActions.every((a) => completed.has(a.id));
      let activeStageId = prev.activeStageId;
      if (allDone && stage) {
        const idx = journeyStagesV2.findIndex((s) => s.id === stage.id);
        if (idx >= 0 && idx < journeyStagesV2.length - 1) {
          activeStageId = journeyStagesV2[idx + 1].id;
        }
      }
      return { ...prev, completedActions: completed, responses, activeStageId };
    });
  }, []);

  const setActiveStage = useCallback((id: string) => {
    setState((prev) => ({ ...prev, activeStageId: id }));
  }, []);

  const setResponse = useCallback((id: string, response: V2Response) => {
    setState((prev) => ({
      ...prev,
      responses: { ...prev.responses, [id]: response },
    }));
  }, []);

  const setManualEntryField = useCallback((key: string, value: string) => {
    setState((prev) => ({
      ...prev,
      manualEntry: { ...prev.manualEntry, [key]: value },
    }));
  }, []);

  const advanceManualEntry = useCallback(() => {
    setState((prev) => ({ ...prev, manualEntryStep: prev.manualEntryStep + 1 }));
  }, []);

  const setCustomerApproval = useCallback((s: CustomerApprovalState) => {
    setState((prev) => ({ ...prev, customerApproval: s }));
  }, []);

  const setAffidavitAccepted = useCallback((b: boolean) => {
    setState((prev) => ({ ...prev, affidavitAccepted: b }));
  }, []);

  const setAttested = useCallback((b: boolean) => {
    setState((prev) => ({ ...prev, attested: b }));
  }, []);

  const setSignatureName = useCallback((s: string) => {
    setState((prev) => ({ ...prev, signatureName: s }));
  }, []);

  const submit = useCallback(() => {
    setState((prev) => ({ ...prev, submitted: true }));
  }, []);

  const dismissBanner = useCallback(() => {
    setState((prev) => ({ ...prev, showDemoBanner: false }));
  }, []);

  const toggleSidePanel = useCallback(() => {
    setState((prev) => ({ ...prev, sidePanelOpen: !prev.sidePanelOpen }));
  }, []);

  const revealDraft = useCallback(() => {
    setState((prev) => ({ ...prev, draftRevealed: true }));
  }, []);

  const signInMock = useCallback(() => {
    setState((prev) => ({
      ...prev,
      signedIn: true,
      manualEntry: {
        companyName: mockPartnerProfile.companyName,
        headquarters: mockPartnerProfile.headquarters,
        companySize: mockPartnerProfile.companySize,
        engagement: "Azure AI migration for Fabrikam Industries",
      },
      manualEntryStep: 4,
    }));
  }, []);

  const sendCustomerLink = useCallback(() => {
    setState((prev) => ({ ...prev, customerLinkSent: true }));
  }, []);

  const simulateCustomerResponse = useCallback(() => {
    setState((prev) => ({ ...prev, customerLinkReceived: true }));
  }, []);

  const setAddon = useCallback((key: keyof V2Addons, value: boolean) => {
    setState((prev) => ({
      ...prev,
      addons: { ...prev.addons, [key]: value },
    }));
  }, []);

  const resetJourney = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
  }, []);

  const getStageProgress = useCallback((stageId: string) => {
    const stage = journeyStagesV2.find((s) => s.id === stageId);
    if (!stage) return { completed: 0, total: 0 };
    const completed = stage.actions.filter((a) =>
      state.completedActions.has(a.id)
    ).length;
    return { completed, total: stage.actions.length };
  }, [state.completedActions]);

  const isActionComplete = useCallback(
    (id: string) => state.completedActions.has(id),
    [state.completedActions]
  );

  const isActionActive = useCallback(
    (stageId: string, actionId: string) => {
      if (state.activeStageId !== stageId) return false;
      const stage = journeyStagesV2.find((s) => s.id === stageId);
      if (!stage) return false;
      const first = stage.actions.find((a) => !state.completedActions.has(a.id));
      return first?.id === actionId;
    },
    [state.activeStageId, state.completedActions]
  );

  const value = useMemo(
    () => ({
      state,
      stages: journeyStagesV2,
      profile: mockPartnerProfile,
      completeAction,
      setActiveStage,
      setResponse,
      setManualEntryField,
      advanceManualEntry,
      setCustomerApproval,
      setAffidavitAccepted,
      setAttested,
      setSignatureName,
      submit,
      dismissBanner,
      toggleSidePanel,
      revealDraft,
      signInMock,
      sendCustomerLink,
      simulateCustomerResponse,
      setAddon,
      resetJourney,
      getStageProgress,
      isActionComplete,
      isActionActive,
    }),
    [
      state,
      completeAction,
      setActiveStage,
      setResponse,
      setManualEntryField,
      advanceManualEntry,
      setCustomerApproval,
      setAffidavitAccepted,
      setAttested,
      setSignatureName,
      submit,
      dismissBanner,
      toggleSidePanel,
      revealDraft,
      signInMock,
      sendCustomerLink,
      simulateCustomerResponse,
      setAddon,
      resetJourney,
      getStageProgress,
      isActionComplete,
      isActionActive,
    ]
  );

  return <V2Context.Provider value={value}>{children}</V2Context.Provider>;
}

export function useJourneyV2() {
  const ctx = useContext(V2Context);
  if (!ctx) throw new Error("useJourneyV2 must be used within JourneyV2Provider");
  return ctx;
}
