"use client";

import { supabase } from "@/services/supabaseClient";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import Vapi from "@vapi-ai/web";
import axios from "axios";
import { Loader2, Mic, Phone, Timer } from "lucide-react";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import AlertConfirmation from "./_components/AlertConfirmation";

function StartInterview() {
  const { interview_id } = useParams();
  const router = useRouter();
  const { interviewInfo } = useContext(InterviewDataContext);

  const vapiRef = useRef(null);
  const hasStartedRef = useRef(false);
  const hasHandledEndRef = useRef(false);
  const hasTimerStartedRef = useRef(false);
  const transcriptCountRef = useRef(0);
  const conversationRef = useRef(null);
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const [transcripts, setTranscripts] = useState([]);
  const [partialTranscripts, setPartialTranscripts] = useState({
    assistant: "",
    user: "",
  });
  const [activeUSer, setActiveUser] = useState(false);
  const [, setConversation] = useState(null);
  const [isEnding, setIsEnding] = useState(false);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const latestAssistantTranscript =
    partialTranscripts.assistant ||
    [...transcripts].reverse().find((item) => item.role === "assistant")?.transcript ||
    "Waiting for AI recruiter...";

  const latestUserTranscript =
    partialTranscripts.user ||
    [...transcripts].reverse().find((item) => item.role === "user")?.transcript ||
    "Your live speech will appear here...";

  useEffect(() => {
    if (!isTimerRunning) {
      return undefined;
    }

    const timerId = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isTimerRunning]);

  useEffect(() => {
    let isMounted = true;

    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
          },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        mediaStreamRef.current = stream;

        setIsCameraReady(true);
      } catch (error) {
        console.log("camera setup error:", error);
        setIsCameraReady(false);
      }
    };

    setupCamera();

    return () => {
      isMounted = false;

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    const stream = mediaStreamRef.current;

    if (!videoElement || !stream) {
      return;
    }

    videoElement.srcObject = stream;

    const handleLoadedMetadata = async () => {
      try {
        await videoElement.play();
      } catch (error) {
        console.log("video play error:", error);
      }
    };

    videoElement.onloadedmetadata = handleLoadedMetadata;
    handleLoadedMetadata();

    return () => {
      videoElement.onloadedmetadata = null;
    };
  }, [isCameraReady]);

  const formatTime = (totalSeconds) => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  const GenerateFeedback = async (conversationData) => {
    if (!conversationData?.length) {
      console.log("feedback skipped: conversation is empty");
      return null;
    }

    try {
      const result = await axios.post("/api/ai-feedback", {
        conversation: conversationData,
      });

      const rawFeedback = result?.data?.result || result?.data?.content || "";

      if (!rawFeedback) {
        console.log("feedback response missing text", result?.data);
        return null;
      }

      const finalContent = rawFeedback
        .replace("```json", "")
        .replace("```", "")
        .trim();

      const parsedFeedback = JSON.parse(finalContent);

      const { data, error } = await supabase
        .from("interview-feedback")
        .insert([
          {
            userName: interviewInfo?.userName,
            userEmail: interviewInfo?.userEmail,
            interview_id,
            feedback: parsedFeedback,
            recommended: false,
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      console.log("table insert data:", data);
      return parsedFeedback;
    } catch (error) {
      console.log("feedback error:", error);
      return null;
    }
  };

  const completeInterview = async () => {
    if (hasHandledEndRef.current) {
      return;
    }

    hasHandledEndRef.current = true;
    setIsTimerRunning(false);
    setIsCallConnected(false);
    setIsEnding(true);

    try {
      await GenerateFeedback(conversationRef.current);
    } finally {
      router.replace(`/interview/${interview_id}/completed`);
    }
  };

  const handleStopInterview = async () => {
    if (isEnding) {
      return;
    }

    setIsEnding(true);

    try {
      await vapiRef.current?.stop();
    } catch (error) {
      console.log("stop interview error:", error);
      await completeInterview();
    }
  };

  useEffect(() => {
    if (!vapiRef.current) {
      vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_KEY);
    }

    const handleMessage = (message) => {
      console.log("vapi message:", message);

      if (message?.conversation) {
        conversationRef.current = message.conversation;
        setConversation(message.conversation);
      }

      if (!message?.type?.startsWith("transcript") || !message?.transcript) {
        return;
      }

      const role = message.role === "assistant" ? "assistant" : "user";

      if (message.transcriptType === "partial") {
        setPartialTranscripts((prev) => ({
          ...prev,
          [role]: message.transcript,
        }));
        return;
      }

      transcriptCountRef.current += 1;
      setTranscripts((prev) => [
        ...prev,
        {
          id: `${role}-${transcriptCountRef.current}`,
          role,
          transcript: message.transcript,
        },
      ]);
      setPartialTranscripts((prev) => ({
        ...prev,
        [role]: "",
      }));
    };

    const handleError = (error) => {
      console.log("vapi error:", error);
    };

    const handleCallEnd = async () => {
      toast("Interview Ended..");
      console.log("vapi call ended");
      await completeInterview();
    };

    const handleCallStart = () => {
      toast("Call Connected...");
      console.log("vapi call started");
      setIsCallConnected(true);
    };

    const handleSpeechStart = () => {
      if (!hasTimerStartedRef.current) {
        hasTimerStartedRef.current = true;
        setIsTimerRunning(true);
      }

      setActiveUser(false);
    };

    const handleSpeechEnd = () => {
      setActiveUser(true);
    };

    vapiRef.current.on("speech-start", handleSpeechStart);
    vapiRef.current.on("speech-end", handleSpeechEnd);
    vapiRef.current.on("message", handleMessage);
    vapiRef.current.on("error", handleError);
    vapiRef.current.on("call-end", handleCallEnd);
    vapiRef.current.on("call-start", handleCallStart);

    if (interviewInfo && !hasStartedRef.current) {
      hasStartedRef.current = true;
      startCall();
    }

    return () => {
      if (typeof vapiRef.current?.off === "function") {
        vapiRef.current.off("message", handleMessage);
        vapiRef.current.off("error", handleError);
        vapiRef.current.off("call-end", handleCallEnd);
        vapiRef.current.off("call-start", handleCallStart);
        vapiRef.current.off("speech-start", handleSpeechStart);
        vapiRef.current.off("speech-end", handleSpeechEnd);
      }

      setIsTimerRunning(false);
    };
  }, [interviewInfo]);

  const startCall = async () => {
    let questionList = "";

    interviewInfo?.interviewData?.questionList.forEach((item) => {
      questionList = item?.question + "," + questionList;
    });

    const assistantOptions = {
      name: "AI Recruiter",
      silenceTimeoutSeconds: 60,
      firstMessage:
        "Hi " +
        interviewInfo?.userName +
        ", how are you? Ready for your interview on " +
        interviewInfo?.interviewData?.jobPosition +
        "?",
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "11labs",
        voiceId: "burt",
      },
      model: {
        provider: "openai",
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions and assess their responses.

Begin the conversation with a friendly introduction, setting a relaxed yet professional tone.

Example:
"Hey there! Welcome to your ${interviewInfo?.interviewData?.jobPosition} interview. Let's get started with a few questions!"

Ask one question at a time and wait for the candidate's response before proceeding.

Keep the questions clear and concise.

Below are the questions. Ask them one by one.

Questions:
${questionList}

If the candidate struggles, offer hints or rephrase the question without giving away the answer.

Example:
"Need a hint? Think about how React tracks component updates!"

Provide brief, encouraging feedback after each answer.

Examples:
"Nice! That's a solid answer."
"Hmm, not quite! Want to try again?"

Keep the conversation natural and engaging - use casual phrases like:
"Alright, next up..."
"Let's tackle a tricky one!"

After 5-7 questions, wrap up the interview smoothly by summarizing their performance.

Example:
"That was great! You handled some tough questions well. Keep sharpening your skills!"

End on a positive note:
"Thanks for chatting! Hope to see you crushing projects soon!"

Key Guidelines:
- Be friendly, engaging, and witty
- Keep responses short and natural
- Adapt based on the candidate's confidence level
- Ensure the interview remains focused on React
            `.trim(),
          },
        ],
      },
    };

    try {
      await vapiRef.current.start(
        assistantOptions,
        undefined,
        undefined,
        undefined,
        undefined,
        { roomDeleteOnUserLeaveEnabled: false }
      );
    } catch (error) {
      console.log(error);
      toast("Unable to start the interview");
    }
  };

  return (
    <div className="p-20 lg:px-48 xl:px-56">
      <h2 className="flex justify-between text-xl font-bold">
        AI Interview Session
        <span className="flex items-center gap-2">
          <Timer />
          {formatTime(elapsedSeconds)}
        </span>
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-7 md:grid-cols-2">
        <div className="flex flex-col">
          <div className="relative flex h-100 flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm dark:border-white/10 dark:bg-[#11203a]/92">
            <div className="relative flex h-full w-full items-center justify-center">
              {!activeUSer ? (
                <>
                  <span className="absolute inline-flex h-20 w-20 animate-ping rounded-full bg-blue-400/40" />
                  <span className="absolute inline-flex h-16 w-16 rounded-full bg-blue-300/50" />
                </>
              ) : null}

              <Image
                src="/ai.png"
                alt="ai"
                width={100}
                height={100}
                className="relative h-[60px] w-[60px] rounded-full object-cover"
              />
            </div>

            <div className="absolute bottom-4 left-1/2 w-fit min-w-[150px] -translate-x-1/2 rounded-xl bg-black/45 px-5 py-3 text-center text-white backdrop-blur-sm">
              <h2 className="font-medium">AI Recruiter</h2>
            </div>
          </div>
          <div className="mt-3 flex h-[88px] flex-col justify-start rounded-xl border border-border bg-card/90 px-4 py-3 text-sm text-card-foreground shadow-sm dark:border-white/10 dark:bg-[#11203a]/92">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-200">
              Live Transcription
            </p>
            <p className="mt-1.5 h-10 overflow-hidden text-sm leading-5 text-muted-foreground dark:text-slate-200/90">
              {latestAssistantTranscript}
            </p>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="relative flex h-100 flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm dark:border-white/10 dark:bg-[#11203a]/92">
            <div className="relative flex h-full w-full items-center justify-center">
              {activeUSer ? (
                <>
                  <span className="absolute inline-flex h-20 w-20 animate-ping rounded-full bg-emerald-400/40" />
                  <span className="absolute inline-flex h-16 w-16 rounded-full bg-emerald-300/50" />
                </>
              ) : null}

              {isCameraReady ? (
                <div className="absolute inset-0 overflow-hidden bg-[#0b1425]">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full scale-x-[-1] object-cover"
                  />
                </div>
              ) : (
                <h2 className="relative rounded-full bg-primary px-6 py-3 text-2xl text-white">
                  {interviewInfo?.userName?.[0]}
                </h2>
              )}
            </div>

            <div className="absolute bottom-4 left-1/2 w-fit min-w-[150px] max-w-[80%] -translate-x-1/2 rounded-xl bg-black/45 px-5 py-3 text-center text-white backdrop-blur-sm">
              <h2 className="font-medium">{interviewInfo?.userName}</h2>
            </div>
          </div>
          <div className="mt-3 flex h-[88px] flex-col justify-start rounded-xl border border-border bg-card/90 px-4 py-3 text-sm text-card-foreground shadow-sm dark:border-white/10 dark:bg-[#11203a]/92">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-300">
              Live Transcription
            </p>
            <p className="mt-1.5 h-10 overflow-hidden text-sm leading-5 text-muted-foreground dark:text-slate-200/90">
              {latestUserTranscript}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-8">
        <Mic className="h-12 w-12 cursor-pointer rounded-full bg-muted p-3 text-muted-foreground dark:bg-[#11203a] dark:text-blue-100" />

        <AlertConfirmation stopinterview={handleStopInterview} isEnding={isEnding}>
          {isEnding ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Phone className="h-5 w-5" />
          )}
        </AlertConfirmation>
      </div>

      <h2 className="mt-5 flex items-center justify-center gap-2 text-center text-sm font-semibold text-muted-foreground">
        {isTimerRunning ? (
          <>
            <Timer size={16} />
            Interviewer connected
          </>
        ) : (
          <>
            <Loader2 size={16} className="animate-spin" />
            Connecting you to the AI interviewer...
          </>
        )}
      </h2>

    </div>
  );
}

export default StartInterview;
