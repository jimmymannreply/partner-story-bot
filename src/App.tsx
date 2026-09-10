import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { JourneyProvider } from "@/hooks/useJourneyState";
import { SpeechProvider } from "@/hooks/useSpeech";
import { LandingPage } from "@/pages/LandingPage";
import { MockPartnerPage } from "@/pages/MockPartnerPage";
import { JourneyPage } from "@/pages/JourneyPage";
import { ConsentPage } from "@/pages/ConsentPage";
import { JourneyV2Provider } from "@/v2/hooks/useJourneyV2";
import { LandingPageV2 } from "@/v2/pages/LandingPageV2";
import { JourneyPageV2 } from "@/v2/pages/JourneyPageV2";
import { SubmissionsQueuePage } from "@/v2/pages/SubmissionsQueuePage";

const basename =
  import.meta.env.BASE_URL === "/" ? undefined : import.meta.env.BASE_URL.replace(/\/$/, "");

const v2Standalone = import.meta.env.VITE_V2_STANDALONE === "true";
const v2Base = v2Standalone ? "/" : "/v2";
const v2Journey = v2Standalone ? "/journey" : "/v2/journey";
const v2Submissions = v2Standalone ? "/submissions" : "/v2/submissions";

function V1Shell() {
  return (
    <JourneyProvider>
      <Outlet />
    </JourneyProvider>
  );
}

function V2Shell() {
  return (
    <JourneyV2Provider>
      <Outlet />
    </JourneyV2Provider>
  );
}

export default function App() {
  return (
    <SpeechProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route element={<V1Shell />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/partner" element={<MockPartnerPage />} />
            <Route path="/journey" element={<JourneyPage />} />
            <Route path="/consent" element={<ConsentPage />} />
          </Route>
          <Route element={<V2Shell />}>
            <Route path={v2Base} element={<LandingPageV2 />} />
            <Route path={v2Journey} element={<JourneyPageV2 />} />
            <Route path={v2Submissions} element={<SubmissionsQueuePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SpeechProvider>
  );
}
