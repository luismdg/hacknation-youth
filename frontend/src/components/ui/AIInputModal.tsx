// /src/components/AIInputModal.tsx
import { useState } from "react";
import { Sparkles, Loader2, X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VoiceRecorder } from "./VoiceRecorder";

interface AIInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySuggestion: (suggestion: any) => void;
  profileData: any;
  baseColor?: string;
}

export function AIInputModal({ isOpen, onClose, onApplySuggestion, profileData, baseColor = "var(--color-coral)" }: AIInputModalProps) {
  const [textInput, setTextInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const processInput = async (input: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      const { enhanceWithVoiceInput } = await import("@/services/geminiService");
      const result = await enhanceWithVoiceInput(profileData, input);
      setAiSuggestion(result);
    } catch (err) {
      setError("Failed to process. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceTranscription = (text: string) => {
    setTextInput(text);
    processInput(text);
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      processInput(textInput);
    }
  };

  const handleApply = () => {
    if (aiSuggestion) {
      onApplySuggestion(aiSuggestion);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border bg-white shadow-xl" style={{ borderColor: "var(--color-border)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b p-5" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" style={{ color: baseColor }} />
            <h3 className="font-semibold" style={{ color: "var(--color-ink)" }}>AI Assistant</h3>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-[13px] text-muted-foreground">
            Tell me what you want to add or change in your profile. I'll help make it better.
          </p>

          <VoiceRecorder onTranscription={handleVoiceTranscription} onError={setError} />

          <div className="relative">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Or type here... e.g., 'I learned Python last month', 'Add that I can speak French'"
              className="w-full rounded-xl border p-3 text-[14px] resize-none"
              style={{ borderColor: "var(--color-border)" }}
              rows={3}
            />
            <Button
              onClick={handleTextSubmit}
              disabled={!textInput.trim() || isProcessing}
              className="absolute bottom-2 right-2 rounded-full px-3 py-1 text-[12px]"
              style={{ background: baseColor, color: "white" }}
            >
              {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : "Analyze"}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg p-2" style={{ background: "var(--color-warn-soft)", color: "var(--color-warn)" }}>
              <AlertCircle className="h-4 w-4" />
              <span className="text-[12px]">{error}</span>
            </div>
          )}

          {aiSuggestion && aiSuggestion.response && (
            <div className="rounded-xl border p-4" style={{ borderColor: baseColor, background: "var(--color-coral-soft)" }}>
              <p className="text-[14px] font-medium" style={{ color: "var(--color-ink)" }}>AI Suggestion:</p>
              <p className="mt-1 text-[13px] text-muted-foreground">{aiSuggestion.response}</p>
              
              {aiSuggestion.extractedData && Object.keys(aiSuggestion.extractedData).some(k => aiSuggestion.extractedData[k]) && (
                <div className="mt-3 border-t pt-2" style={{ borderColor: "var(--color-border)" }}>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">I can add:</p>
                  <ul className="mt-1 space-y-1 text-[12px]">
                    {aiSuggestion.extractedData.headline && <li>• New headline: {aiSuggestion.extractedData.headline}</li>}
                    {aiSuggestion.extractedData.skills?.length > 0 && <li>• Skills: {aiSuggestion.extractedData.skills.join(", ")}</li>}
                    {aiSuggestion.extractedData.experienceName && <li>• Experience: {aiSuggestion.extractedData.experienceName}</li>}
                  </ul>
                </div>
              )}
              
              <button
                onClick={handleApply}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full py-2 text-[13px] font-medium text-white transition-colors hover:opacity-90"
                style={{ background: baseColor }}
              >
                <Check className="h-4 w-4" />
                Apply these changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}