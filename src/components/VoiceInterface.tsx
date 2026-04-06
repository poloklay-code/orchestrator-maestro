import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type Status = "idle" | "recording" | "processing" | "speaking" | "error";
interface Msg { role: "user" | "assistant"; text: string; ts: Date; }

export function VoiceInterface() {
  const [status, setStatus] = useState<Status>("idle");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [transcript, setTranscript] = useState("");
  const [err, setErr] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const speak = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) { setStatus("idle"); return; }
    window.speechSynthesis.cancel();
    setStatus("speaking");
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "pt-BR";
    u.rate = 0.95;
    const voices = window.speechSynthesis.getVoices();
    const pt = voices.find(v => v.lang.includes("pt"));
    if (pt) u.voice = pt;
    u.onend = () => { setStatus("idle"); setTranscript(""); };
    u.onerror = () => setStatus("idle");
    window.speechSynthesis.speak(u);
  }, []);

  const processText = useCallback(async (text: string) => {
    if (!text?.trim()) { setStatus("idle"); setTranscript(""); return; }
    setMsgs(p => [...p, { role: "user", text, ts: new Date() }]);
    setStatus("processing");
    setTranscript("Pensando...");

    try {
      const { data: response, error } = await supabase.functions.invoke("maestro-ai", {
        body: { action: "voice_command", data: { text } },
      });
      if (error) throw error;
      const answer = typeof response?.result === "string" ? response.result : JSON.stringify(response?.result);
      setMsgs(p => [...p, { role: "assistant", text: answer, ts: new Date() }]);
      speak(answer);
    } catch {
      setErr("Erro ao processar. Tente novamente.");
      setStatus("error");
    }
  }, [speak]);

  const startRecording = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErr("Reconhecimento de voz não suportado neste navegador.");
      setStatus("error");
      return;
    }
    setErr("");
    setStatus("recording");
    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const last = event.results[event.results.length - 1];
      setTranscript(last[0].transcript);
      if (last.isFinal) {
        processText(last[0].transcript);
      }
    };
    recognition.onerror = () => { setErr("Erro no microfone."); setStatus("error"); };
    recognition.onend = () => {
      if (status === "recording") setStatus("idle");
    };
    recognitionRef.current = recognition;
    recognition.start();
  }, [processText, status]);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const STATUS_LABEL: Record<Status, string> = {
    idle: "Pronto", recording: "Gravando...", processing: "Processando...", speaking: "Falando...", error: "Erro",
  };

  return (
    <div className="flex flex-col gap-4 p-6 max-w-xl mx-auto">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${status === "recording" ? "bg-red-500 animate-pulse" : status === "processing" || status === "speaking" ? "bg-primary animate-pulse" : "bg-muted"}`} />
        <Badge variant="secondary">{STATUS_LABEL[status]}</Badge>
        {transcript && <span className="text-xs text-muted-foreground italic truncate max-w-xs">"{transcript}"</span>}
      </div>

      <div className="flex justify-center">
        {(status === "idle" || status === "error") && (
          <button onClick={startRecording}
            className="w-20 h-20 rounded-full bg-primary text-primary-foreground text-3xl flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg">
            🎤
          </button>
        )}
        {status === "recording" && (
          <button onClick={stopRecording}
            className="w-20 h-20 rounded-full bg-destructive text-destructive-foreground text-3xl flex items-center justify-center animate-pulse shadow-lg">
            ⏹
          </button>
        )}
        {status === "processing" && (
          <div className="w-20 h-20 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        )}
        {status === "speaking" && (
          <button onClick={() => { window.speechSynthesis.cancel(); setStatus("idle"); }}
            className="w-20 h-20 rounded-full bg-accent text-accent-foreground text-3xl flex items-center justify-center shadow-lg">
            🔇
          </button>
        )}
      </div>

      {status === "idle" && msgs.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Pressione e fale. Ex: "Maestro, mostre meus leads ativos"
        </p>
      )}
      {err && <p className="text-center text-sm text-destructive">{err}</p>}

      {msgs.length > 0 && (
        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
          {msgs.map((m, i) => (
            <Card key={i} className={`p-3 text-sm ${m.role === "user" ? "ml-10 bg-primary/5" : "mr-10"}`}>
              <p className="text-xs text-muted-foreground font-medium mb-1">{m.role === "user" ? "Você" : "Maestro"}</p>
              <p className="text-foreground">{m.text}</p>
            </Card>
          ))}
        </div>
      )}

      {msgs.length === 0 && (
        <div className="space-y-1">
          {["Quantos leads tenho ativos?", "Gere uma copy para Instagram", "Qual meu ROAS médio?", "Analise minha última campanha"].map(cmd => (
            <button key={cmd} className="w-full text-left text-xs text-primary hover:underline py-0.5"
              onClick={() => processText(cmd)}>
              "{cmd}"
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
