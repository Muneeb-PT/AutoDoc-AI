import { useEffect, useState, useRef, useCallback } from "react";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

const VoiceInput = ({ onTranscript, disabled }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
    return () => recognitionRef.current?.stop();
  }, []);

  const toggleListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join(" ");
      onTranscript(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech error:", event.error);
      setIsListening(false);
      if (event.error === "not-allowed") {
        toast.error("Microphone access denied. Please allow microphone access.");
      }
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    toast.success("Listening... Speak now");
  }, [isListening, onTranscript]);

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={disabled || !supported}
      className={`p-3 rounded-lg border transition-all flex items-center gap-2 text-sm font-medium ${
        isListening
          ? "border-destructive bg-destructive/10 text-destructive animate-pulse"
          : "border-border text-foreground hover:bg-secondary"
      } disabled:opacity-50`}
      title={!supported ? "Voice input is not supported by this browser" : isListening ? "Stop listening" : "Voice input"}
      aria-label={!supported ? "Voice input unavailable" : isListening ? "Stop voice input" : "Start voice input"}
    >
      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
      {isListening ? "Stop" : "Voice"}
    </button>
  );
};

export default VoiceInput;
