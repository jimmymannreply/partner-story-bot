import { useSearchParams } from "react-router-dom";
import { VideoRecorder } from "@/components/capture/VideoRecorder";
import { useState } from "react";

export function ConsentPage() {
  const [params] = useSearchParams();
  const email = params.get("email") ?? "customer";
  const engagement = params.get("engagement") ?? "your engagement";
  const [submitted, setSubmitted] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dl-page p-6">
        <div className="max-w-md rounded-dl border border-dl-border bg-dl-surface p-8 text-center shadow-card">
          <p className="text-2xl font-semibold text-dl-success">Thank you!</p>
          <p className="mt-2 text-sm text-dl-text-secondary">
            Your recording has been received. The partner will be notified.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dl-page px-6 py-12">
      <div className="mx-auto max-w-lg">
        <h1 className="text-2xl font-semibold text-dl-text">
          Share your experience
        </h1>
        <p className="mt-2 text-sm text-dl-text-secondary">
          Hi {email} — please record a short video or voice message about{" "}
          <strong>{engagement}</strong>. By submitting, you consent to Microsoft
          and the partner using your quote in marketing materials.
        </p>
        <div className="mt-6 rounded-dl border border-dl-border bg-dl-surface p-4">
          <p className="mb-3 text-sm font-medium">Record your testimonial</p>
          <VideoRecorder
            onRecordingComplete={(_blob, url) => setRecordingUrl(url)}
          />
          {recordingUrl && (
            <button
              type="button"
              onClick={() => setSubmitted(true)}
              className="mt-4 w-full rounded-dl bg-dl-brand px-4 py-2 text-sm text-white"
              data-testid="submit-consent-recording"
            >
              Submit recording with consent
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
