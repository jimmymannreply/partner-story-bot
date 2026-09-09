import { BrowserRouter, Route, Routes } from "react-router-dom";
import { JourneyProvider } from "@/hooks/useJourneyState";
import { SpeechProvider } from "@/hooks/useSpeech";
import { LandingPage } from "@/pages/LandingPage";
import { MockPartnerPage } from "@/pages/MockPartnerPage";
import { JourneyPage } from "@/pages/JourneyPage";
import { ConsentPage } from "@/pages/ConsentPage";

const basename =
  import.meta.env.BASE_URL === "/" ? undefined : import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <SpeechProvider>
      <JourneyProvider>
        <BrowserRouter basename={basename}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/partner" element={<MockPartnerPage />} />
            <Route path="/journey" element={<JourneyPage />} />
            <Route path="/consent" element={<ConsentPage />} />
          </Routes>
        </BrowserRouter>
      </JourneyProvider>
    </SpeechProvider>
  );
}
