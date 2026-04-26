// /src/components/VoiceRecorder.tsx
import { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2 } from "lucide-react";

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  onError?: (error: string) => void;
  buttonText?: string;
  className?: string;
  baseColor?: string;
}

export function VoiceRecorder({ 
  onTranscription, 
  onError, 
  buttonText = "Record voice", 
  className = "",
  baseColor = "var(--color-coral)"
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone error:", error);
      onError?.("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      // Import the service dynamically
      const { transcribeAudio } = await import("@/services/geminiService");
      const text = await transcribeAudio(audioBlob);
      onTranscription(text);
    } catch (error) {
      console.error("Processing error:", error);
      onError?.("Failed to process voice input.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  return (
    <button
      type="button"
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isProcessing}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all ${className}`}
      style={{
        background: isRecording ? "var(--color-warn)" : "white",
        borderColor: "var(--color-border)",
        border: "1px solid",
        color: isRecording ? "white" : "var(--color-ink)",
      }}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isRecording ? (
        <Square className="h-3.5 w-3.5" />
      ) : (
        <Mic className="h-3.5 w-3.5" style={{ color: baseColor }} />
      )}
      {isRecording ? "Stop recording" : isProcessing ? "Processing..." : buttonText}
    </button>
  );
}