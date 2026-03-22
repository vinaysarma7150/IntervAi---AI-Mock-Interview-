"use client";

import { ScrollText } from "lucide-react";

function TranscriptBubble({ speaker, text, isPartial }) {
  const isAssistant = speaker === "assistant";

  return (
    <div
      className={`w-full rounded-xl px-4 py-3 ${
        isAssistant
          ? "bg-blue-50 text-gray-900 dark:bg-[#163157] dark:text-blue-50"
          : "bg-gray-900 text-white dark:bg-[#0d1728] dark:text-slate-100"
      } ${isPartial ? "border border-dashed border-gray-300 dark:border-white/15" : ""}`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-[0.2em] ${
          isAssistant ? "text-blue-600 dark:text-blue-200" : "text-gray-300 dark:text-slate-400"
        }`}
      >
        {isAssistant ? "AI Recruiter" : "You"}
      </p>
      <p className="mt-2 text-sm leading-6">
        {text}
        {isPartial ? <span className="ml-1 animate-pulse">...</span> : null}
      </p>
    </div>
  );
}

function LiveTranscript({ transcripts, partialTranscripts, userName }) {
  const transcriptItems = [
    ...transcripts,
    ...(partialTranscripts.assistant
      ? [
          {
            id: "assistant-partial",
            role: "assistant",
            transcript: partialTranscripts.assistant,
            isPartial: true,
          },
        ]
      : []),
    ...(partialTranscripts.user
      ? [
          {
            id: "user-partial",
            role: "user",
            transcript: partialTranscripts.user,
            isPartial: true,
          },
        ]
      : []),
  ];

  return (
    <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm dark:border-white/10 dark:bg-[#11203a]/92">
      <div className="flex items-center justify-between gap-3 border-b pb-3">
        <div>
          <h3 className="text-base font-semibold text-card-foreground">Live Transcript</h3>
          <p className="text-xs text-muted-foreground">
            AI Recruiter and {userName || "you"} in one feed.
          </p>
        </div>

        <div className="rounded-full bg-muted p-2 text-muted-foreground dark:bg-white/8">
          <ScrollText className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 flex h-[220px] flex-col gap-2 overflow-y-auto pr-1">
        {transcriptItems.length ? (
          transcriptItems.map((item) => (
            <TranscriptBubble
              key={item.id}
              speaker={item.role}
              text={item.transcript}
              isPartial={item.isPartial}
            />
          ))
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/50 px-6 text-center text-sm text-muted-foreground dark:border-white/10 dark:bg-[#0d1728]">
            Transcript will appear here once the interview starts.
          </div>
        )}
      </div>
    </div>
  );
}

export default LiveTranscript;
