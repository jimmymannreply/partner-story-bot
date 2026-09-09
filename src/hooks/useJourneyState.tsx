import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { journeyStages } from "@/data/journeyStages";
import {
  mockDesignations,
  mockEngagements,
  mockPartnerProfile,
  type CustomerApprovalState,
  type Designation,
  type Engagement,
} from "@/data/mockPartnerData";

export interface ActionResponse {
  value: string;
  files?: string[];
}

export interface JourneyState {
  activeStageId: string;
  completedActions: Set<string>;
  responses: Record<string, ActionResponse>;
  signedIn: boolean;
  profileConfirmed: boolean;
  designations: Designation[];
  selectedEngagement: Engagement | null;
  customEngagement: string;
  customerApproval: CustomerApprovalState;
  affidavitAccepted: boolean;
  skipAheadCount: number;
  customerEmails: string[];
  customerVideoReceived: boolean;
  attested: boolean;
  signatureName: string;
  signatureDataUrl: string;
  submitted: boolean;
  engineStep: number;
  showDemoBanner: boolean;
  sidePanelOpen: boolean;
}

const initialState: JourneyState = {
  activeStageId: "collect",
  completedActions: new Set(),
  responses: {},
  signedIn: false,
  profileConfirmed: false,
  designations: [...mockDesignations],
  selectedEngagement: null,
  customEngagement: "",
  customerApproval: "Unknown",
  affidavitAccepted: false,
  skipAheadCount: 0,
  customerEmails: [],
  customerVideoReceived: false,
  attested: false,
  signatureName: "",
  signatureDataUrl: "",
  submitted: false,
  engineStep: 0,
  showDemoBanner: true,
  sidePanelOpen: false,
};

interface JourneyContextValue {
  state: JourneyState;
  profile: typeof mockPartnerProfile;
  engagements: typeof mockEngagements;
  stages: typeof journeyStages;
  completeAction: (actionId: string, response?: ActionResponse) => void;
  setActiveStage: (stageId: string) => void;
  setResponse: (actionId: string, response: ActionResponse) => void;
  signIn: () => void;
  confirmProfile: () => void;
  setDesignations: (d: Designation[]) => void;
  selectEngagement: (e: Engagement | null) => void;
  setCustomEngagement: (s: string) => void;
  setCustomerApproval: (s: CustomerApprovalState) => void;
  setAffidavitAccepted: (b: boolean) => void;
  setCustomerEmails: (emails: string[]) => void;
  simulateCustomerVideo: () => void;
  setAttested: (b: boolean) => void;
  setSignatureName: (s: string) => void;
  setSignatureDataUrl: (s: string) => void;
  submit: () => void;
  advanceEngine: () => void;
  dismissBanner: () => void;
  toggleSidePanel: () => void;
  resetJourney: () => void;
  getStageProgress: (stageId: string) => { completed: number; total: number };
  isActionComplete: (actionId: string) => boolean;
  isActionActive: (stageId: string, actionId: string) => boolean;
}

const JourneyContext = createContext<JourneyContextValue | null>(null);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<JourneyState>(initialState);

  const completeAction = useCallback(
    (actionId: string, response?: ActionResponse) => {
      setState((prev) => {
        const completed = new Set(prev.completedActions);
        completed.add(actionId);
        const responses = response
          ? { ...prev.responses, [actionId]: response }
          : prev.responses;

        let skipAheadCount = prev.skipAheadCount;
        if (actionId === "materials" && response?.files?.length) {
          skipAheadCount = 6;
        }

        const stage = journeyStages.find((s) =>
          s.actions.some((a) => a.id === actionId)
        );
        const stageActions = stage?.actions ?? [];
        const allDone = stageActions.every((a) => completed.has(a.id));
        let activeStageId = prev.activeStageId;
        if (allDone && stage) {
          const idx = journeyStages.findIndex((s) => s.id === stage.id);
          if (idx < journeyStages.length - 1) {
            activeStageId = journeyStages[idx + 1].id;
          }
        }

        return {
          ...prev,
          completedActions: completed,
          responses,
          skipAheadCount,
          activeStageId,
        };
      });
    },
    []
  );

  const setActiveStage = useCallback((stageId: string) => {
    setState((prev) => ({ ...prev, activeStageId: stageId }));
  }, []);

  const setResponse = useCallback((actionId: string, response: ActionResponse) => {
    setState((prev) => ({
      ...prev,
      responses: { ...prev.responses, [actionId]: response },
    }));
  }, []);

  const signIn = useCallback(() => {
    setState((prev) => ({ ...prev, signedIn: true }));
    completeAction("sign-in");
  }, [completeAction]);

  const confirmProfile = useCallback(() => {
    setState((prev) => ({ ...prev, profileConfirmed: true }));
    completeAction("confirm-profile");
  }, [completeAction]);

  const setDesignations = useCallback(
    (d: Designation[]) => setState((prev) => ({ ...prev, designations: d })),
    []
  );

  const selectEngagement = useCallback(
    (e: Engagement | null) =>
      setState((prev) => ({ ...prev, selectedEngagement: e })),
    []
  );

  const setCustomEngagement = useCallback(
    (s: string) => setState((prev) => ({ ...prev, customEngagement: s })),
    []
  );

  const setCustomerApproval = useCallback(
    (s: CustomerApprovalState) =>
      setState((prev) => ({ ...prev, customerApproval: s })),
    []
  );

  const setAffidavitAccepted = useCallback(
    (b: boolean) => setState((prev) => ({ ...prev, affidavitAccepted: b })),
    []
  );

  const setCustomerEmails = useCallback(
    (emails: string[]) =>
      setState((prev) => ({ ...prev, customerEmails: emails })),
    []
  );

  const simulateCustomerVideo = useCallback(() => {
    setState((prev) => ({ ...prev, customerVideoReceived: true }));
    completeAction("customer-record");
    completeAction("customer-received");
  }, [completeAction]);

  const setAttested = useCallback(
    (b: boolean) => setState((prev) => ({ ...prev, attested: b })),
    []
  );

  const setSignatureName = useCallback(
    (s: string) => setState((prev) => ({ ...prev, signatureName: s })),
    []
  );

  const setSignatureDataUrl = useCallback(
    (s: string) => setState((prev) => ({ ...prev, signatureDataUrl: s })),
    []
  );

  const submit = useCallback(() => {
    setState((prev) => ({ ...prev, submitted: true, engineStep: 1 }));
    completeAction("attest");
  }, [completeAction]);

  const advanceEngine = useCallback(() => {
    setState((prev) => {
      const next = Math.min(prev.engineStep + 1, 4);
      if (next === 4) {
        const completed = new Set(prev.completedActions);
        completed.add("submit-engine");
        return { ...prev, engineStep: next, completedActions: completed };
      }
      return { ...prev, engineStep: next };
    });
  }, []);

  const dismissBanner = useCallback(
    () => setState((prev) => ({ ...prev, showDemoBanner: false })),
    []
  );

  const toggleSidePanel = useCallback(
    () => setState((prev) => ({ ...prev, sidePanelOpen: !prev.sidePanelOpen })),
    []
  );

  const resetJourney = useCallback(() => {
    setState({
      ...initialState,
      completedActions: new Set(),
      designations: [...mockDesignations],
    });
  }, []);

  const getStageProgress = useCallback(
    (stageId: string) => {
      const stage = journeyStages.find((s) => s.id === stageId);
      if (!stage) return { completed: 0, total: 0 };
      const completed = stage.actions.filter((a) =>
        state.completedActions.has(a.id)
      ).length;
      return { completed, total: stage.actions.length };
    },
    [state.completedActions]
  );

  const isActionComplete = useCallback(
    (actionId: string) => state.completedActions.has(actionId),
    [state.completedActions]
  );

  const isActionActive = useCallback(
    (stageId: string, actionId: string) => {
      if (state.activeStageId !== stageId) return false;
      const stage = journeyStages.find((s) => s.id === stageId);
      if (!stage) return false;
      const firstIncomplete = stage.actions.find(
        (a) => !state.completedActions.has(a.id)
      );
      return firstIncomplete?.id === actionId;
    },
    [state.activeStageId, state.completedActions]
  );

  const value = useMemo(
    () => ({
      state,
      profile: mockPartnerProfile,
      engagements: mockEngagements,
      stages: journeyStages,
      completeAction,
      setActiveStage,
      setResponse,
      signIn,
      confirmProfile,
      setDesignations,
      selectEngagement,
      setCustomEngagement,
      setCustomerApproval,
      setAffidavitAccepted,
      setCustomerEmails,
      simulateCustomerVideo,
      setAttested,
      setSignatureName,
      setSignatureDataUrl,
      submit,
      advanceEngine,
      dismissBanner,
      toggleSidePanel,
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
      signIn,
      confirmProfile,
      setDesignations,
      selectEngagement,
      setCustomEngagement,
      setCustomerApproval,
      setAffidavitAccepted,
      setCustomerEmails,
      simulateCustomerVideo,
      setAttested,
      setSignatureName,
      setSignatureDataUrl,
      submit,
      advanceEngine,
      dismissBanner,
      toggleSidePanel,
      resetJourney,
      getStageProgress,
      isActionComplete,
      isActionActive,
    ]
  );

  return (
    <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
  );
}

export function useJourney() {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error("useJourney must be used within JourneyProvider");
  return ctx;
}
