import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { journeyStages } from "@/data/journeyStages";
import {
  buildEngagementPrefill,
  buildProfilePrefill,
  enrichedEngagements,
  mciEngagements,
  type EngagementDetails,
} from "@/data/prefillData";

const allEngagements = [...enrichedEngagements, ...mciEngagements];
import {
  mockDesignations,
  mockPartnerProfile,
  type CustomerApprovalState,
  type Designation,
} from "@/data/mockPartnerData";
import { openConsentEmail } from "@/lib/consentEmail";
import { validateDesignation } from "@/lib/validation";
import { designationCatalog } from "@/data/mockPartnerData";

const STORAGE_KEY = "partner-story-bot-draft";

export interface ActionResponse {
  value: string;
  files?: string[];
  videoUrl?: string;
}

export interface JourneyState {
  activeStageId: string;
  focusedActionId: string | null;
  completedActions: Set<string>;
  responses: Record<string, ActionResponse>;
  prefilledActions: Set<string>;
  signedIn: boolean;
  guestMode: boolean;
  profileConfirmed: boolean;
  designations: Designation[];
  selectedEngagement: EngagementDetails | null;
  customEngagement: string;
  customerApproval: CustomerApprovalState;
  affidavitAccepted: boolean;
  skipAheadCount: number;
  customerEmails: string[];
  consentEmailsSent: string[];
  customerVideoReceived: boolean;
  attested: boolean;
  signatureName: string;
  signatureDataUrl: string;
  submitted: boolean;
  engineStep: number;
  showDemoBanner: boolean;
  sidePanelOpen: boolean;
  draftSavedAt: string | null;
  rejectedEngagementIds: Set<string>;
}

const initialState: JourneyState = {
  activeStageId: "collect",
  focusedActionId: null,
  completedActions: new Set(),
  responses: {},
  prefilledActions: new Set(),
  signedIn: false,
  guestMode: false,
  profileConfirmed: false,
  designations: [...mockDesignations],
  selectedEngagement: null,
  customEngagement: "",
  customerApproval: "Unknown",
  affidavitAccepted: false,
  skipAheadCount: 0,
  customerEmails: [],
  consentEmailsSent: [],
  customerVideoReceived: false,
  attested: false,
  signatureName: "",
  signatureDataUrl: "",
  submitted: false,
  engineStep: 0,
  showDemoBanner: true,
  sidePanelOpen: false,
  draftSavedAt: null,
  rejectedEngagementIds: new Set(),
};

type PersistedState = Omit<
  JourneyState,
  "completedActions" | "prefilledActions" | "rejectedEngagementIds"
> & {
  completedActions: string[];
  prefilledActions: string[];
  rejectedEngagementIds: string[];
};

function serialize(state: JourneyState): PersistedState {
  return {
    ...state,
    completedActions: Array.from(state.completedActions),
    prefilledActions: Array.from(state.prefilledActions),
    rejectedEngagementIds: Array.from(state.rejectedEngagementIds),
  };
}

function deserialize(data: PersistedState): JourneyState {
  return {
    ...data,
    completedActions: new Set(data.completedActions),
    prefilledActions: new Set(data.prefilledActions),
    rejectedEngagementIds: new Set(data.rejectedEngagementIds ?? []),
  };
}

function mergePrefill(
  responses: Record<string, ActionResponse>,
  prefilled: Set<string>,
  prefill: Record<string, string>
) {
  const next = { ...responses };
  const nextPrefilled = new Set(prefilled);
  for (const [key, value] of Object.entries(prefill)) {
    if (!next[key]?.value) {
      next[key] = { value };
      nextPrefilled.add(key);
    }
  }
  return { responses: next, prefilledActions: nextPrefilled };
}

interface JourneyContextValue {
  state: JourneyState;
  profile: typeof mockPartnerProfile;
  engagements: EngagementDetails[];
  stages: typeof journeyStages;
  completeAction: (actionId: string, response?: ActionResponse) => void;
  setActiveStage: (stageId: string) => void;
  setFocusedAction: (actionId: string | null) => void;
  setResponse: (actionId: string, response: ActionResponse) => void;
  signIn: () => void;
  continueAsGuest: () => void;
  confirmProfile: () => void;
  setDesignations: (d: Designation[]) => void;
  removeDesignation: (id: string) => void;
  addDesignation: (name: string) => string | null;
  selectEngagement: (e: EngagementDetails | null) => void;
  rejectEngagement: (id: string) => void;
  setCustomEngagement: (s: string) => void;
  setCustomerApproval: (s: CustomerApprovalState) => void;
  setAffidavitAccepted: (b: boolean) => void;
  setCustomerEmails: (emails: string[]) => void;
  sendConsentEmails: () => void;
  markCustomerVideoReceived: () => void;
  setAttested: (b: boolean) => void;
  setSignatureName: (s: string) => void;
  setSignatureDataUrl: (s: string) => void;
  submit: () => void;
  advanceEngine: () => void;
  dismissBanner: () => void;
  toggleSidePanel: () => void;
  resetJourney: () => void;
  saveDraft: () => void;
  getStageProgress: (stageId: string) => { completed: number; total: number };
  isActionComplete: (actionId: string) => boolean;
  isActionActive: (stageId: string, actionId: string) => boolean;
}

const JourneyContext = createContext<JourneyContextValue | null>(null);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<JourneyState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return deserialize(JSON.parse(raw) as PersistedState);
    } catch {
      /* ignore */
    }
    return initialState;
  });

  const saveDraft = useCallback(() => {
    const saved = serialize({
      ...state,
      draftSavedAt: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    setState((prev) => ({ ...prev, draftSavedAt: saved.draftSavedAt }));
  }, [state]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serialize(state)));
      } catch {
        /* ignore quota */
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [state]);

  const applyProfilePrefill = useCallback((prev: JourneyState) => {
    const prefill = buildProfilePrefill(mockPartnerProfile);
    const merged = mergePrefill(prev.responses, prev.prefilledActions, prefill);
    return { ...prev, ...merged };
  }, []);

  const applyEngagementPrefill = useCallback(
    (prev: JourneyState, eng: EngagementDetails) => {
      const prefill = buildEngagementPrefill(eng);
      const merged = mergePrefill(prev.responses, prev.prefilledActions, prefill);
      return { ...prev, ...merged };
    },
    []
  );

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

  const setFocusedAction = useCallback((actionId: string | null) => {
    setState((prev) => ({ ...prev, focusedActionId: actionId }));
  }, []);

  const setResponse = useCallback((actionId: string, response: ActionResponse) => {
    setState((prev) => ({
      ...prev,
      responses: { ...prev.responses, [actionId]: response },
    }));
  }, []);

  const signIn = useCallback(() => {
    setState((prev) => {
      let next = { ...prev, signedIn: true, guestMode: false };
      next = applyProfilePrefill(next);
      return next;
    });
    completeAction("sign-in");
  }, [completeAction, applyProfilePrefill]);

  const continueAsGuest = useCallback(() => {
    setState((prev) => {
      const completed = new Set(prev.completedActions);
      completed.add("sign-in");
      completed.add("confirm-profile");
      completed.add("confirm-designations");
      return {
        ...prev,
        guestMode: true,
        signedIn: false,
        completedActions: completed,
        activeStageId: "collect",
        focusedActionId: "select-win",
      };
    });
  }, []);

  const confirmProfile = useCallback(() => {
    setState((prev) => applyProfilePrefill({ ...prev, profileConfirmed: true }));
    completeAction("confirm-profile");
  }, [completeAction, applyProfilePrefill]);

  const setDesignations = useCallback(
    (d: Designation[]) => setState((prev) => ({ ...prev, designations: d })),
    []
  );

  const removeDesignation = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      designations: prev.designations.filter((d) => d.id !== id),
      selectedEngagement:
        prev.selectedEngagement?.id === id ? null : prev.selectedEngagement,
    }));
  }, []);

  const addDesignation = useCallback((name: string): string | null => {
    const error = validateDesignation(name);
    if (error) return error;
    const canonical =
      designationCatalog.find(
        (d) => d.toLowerCase() === name.trim().toLowerCase()
      ) ?? name.trim();
    setState((prev) => {
      if (prev.designations.some((d) => d.name === canonical)) {
        return prev;
      }
      return {
        ...prev,
        designations: [
          ...prev.designations,
          { id: `custom-${Date.now()}`, name: canonical, valid: true },
        ],
      };
    });
    return null;
  }, []);

  const rejectEngagement = useCallback((id: string) => {
    setState((prev) => {
      const rejected = new Set(prev.rejectedEngagementIds);
      rejected.add(id);
      return {
        ...prev,
        rejectedEngagementIds: rejected,
        selectedEngagement:
          prev.selectedEngagement?.id === id ? null : prev.selectedEngagement,
      };
    });
  }, []);

  const selectEngagement = useCallback((e: EngagementDetails | null) => {
    setState((prev) => {
      if (!e) return { ...prev, selectedEngagement: null };
      return applyEngagementPrefill({ ...prev, selectedEngagement: e }, e);
    });
  }, [applyEngagementPrefill]);

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

  const sendConsentEmails = useCallback(() => {
    const engagementName =
      state.selectedEngagement?.name || state.customEngagement || "your engagement";
    const partnerName = state.guestMode
      ? "Partner"
      : mockPartnerProfile.companyName;

    state.customerEmails.forEach((email) => {
      if (!state.consentEmailsSent.includes(email)) {
        openConsentEmail(email, partnerName, engagementName);
      }
    });

    setState((prev) => ({
      ...prev,
      consentEmailsSent: [
        ...new Set([...prev.consentEmailsSent, ...prev.customerEmails]),
      ],
    }));
    completeAction("invite-customer");
  }, [state, completeAction]);

  const markCustomerVideoReceived = useCallback(() => {
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
    localStorage.removeItem(STORAGE_KEY);
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
    localStorage.removeItem(STORAGE_KEY);
    setState({
      ...initialState,
      completedActions: new Set(),
      prefilledActions: new Set(),
      designations: [...mockDesignations],
      rejectedEngagementIds: new Set(),
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
      engagements: allEngagements,
      stages: journeyStages,
      completeAction,
      setActiveStage,
      setFocusedAction,
      setResponse,
      signIn,
      continueAsGuest,
      confirmProfile,
      setDesignations,
      removeDesignation,
      addDesignation,
      selectEngagement,
      rejectEngagement,
      setCustomEngagement,
      setCustomerApproval,
      setAffidavitAccepted,
      setCustomerEmails,
      sendConsentEmails,
      markCustomerVideoReceived,
      setAttested,
      setSignatureName,
      setSignatureDataUrl,
      submit,
      advanceEngine,
      dismissBanner,
      toggleSidePanel,
      resetJourney,
      saveDraft,
      getStageProgress,
      isActionComplete,
      isActionActive,
    }),
    [
      state,
      completeAction,
      setActiveStage,
      setFocusedAction,
      setResponse,
      signIn,
      continueAsGuest,
      confirmProfile,
      setDesignations,
      removeDesignation,
      addDesignation,
      selectEngagement,
      rejectEngagement,
      setCustomEngagement,
      setCustomerApproval,
      setAffidavitAccepted,
      setCustomerEmails,
      sendConsentEmails,
      markCustomerVideoReceived,
      setAttested,
      setSignatureName,
      setSignatureDataUrl,
      submit,
      advanceEngine,
      dismissBanner,
      toggleSidePanel,
      resetJourney,
      saveDraft,
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
