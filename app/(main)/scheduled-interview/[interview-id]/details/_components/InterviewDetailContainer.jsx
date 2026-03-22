import { CalendarDays, Clock3, Tags } from "lucide-react";
import React from "react";
import CandidateList from "./CandidateList";

function InterviewDetailContainer({ interview_detail }) {
  const candidates = interview_detail?.["interview-feedback"] || [];
  const questionList = interview_detail?.questionList || [];
  const createdAtLabel = interview_detail?.created_at
    ? new Date(interview_detail.created_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";
  const interviewType = Array.isArray(interview_detail?.type)
    ? interview_detail.type.join(", ")
    : typeof interview_detail?.type === "string"
      ? interview_detail.type.replace(/[\[\]"]/g, "").split(",").map((item) => item.trim()).filter(Boolean).join(", ")
      : "N/A";

  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm dark:border-white/8 dark:bg-[#101a2c]/92 dark:shadow-[0_22px_45px_rgba(2,8,23,0.38)]">
        <h2 className="text-xl font-bold text-card-foreground">
          {interview_detail?.jobPosition || "Interview"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {interview_detail?.jobDescription || "No description available."}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-5 text-sm dark:border-white/8 sm:grid-cols-3">
          <div>
            <p className="text-muted-foreground">Duration</p>
            <div className="mt-1 flex items-center gap-2 font-semibold text-card-foreground">
              <Clock3 className="h-4 w-4" />
              <span>{interview_detail?.duration || "N/A"}</span>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground">Created On</p>
            <div className="mt-1 flex items-center gap-2 font-semibold text-card-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>{createdAtLabel}</span>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground">Type</p>
            <div className="mt-1 flex items-center gap-2 font-semibold text-card-foreground">
              <Tags className="h-4 w-4" />
              <span>{interviewType}</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400">
            Candidates: {candidates.length}
          </span>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm dark:border-white/8 dark:bg-[#101a2c]/92 dark:shadow-[0_22px_45px_rgba(2,8,23,0.38)]">
        <h3 className="text-lg font-bold text-card-foreground">Interview Questions</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Questions configured for this interview.
        </p>

        {questionList.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            No questions available.
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            {questionList.map((item, index) => (
              <div
                key={`${item?.question || "question"}-${index}`}
                className="rounded-2xl border border-border bg-muted/40 px-4 py-4 dark:border-white/8 dark:bg-[#11203a]/82"
              >
                <p className="text-sm font-semibold text-card-foreground">
                  Question {index + 1}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {item?.question || "Question text unavailable"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm dark:border-white/8 dark:bg-[#101a2c]/92 dark:shadow-[0_22px_45px_rgba(2,8,23,0.38)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-card-foreground">Output List</h3>
            <p className="text-sm text-muted-foreground">
              Candidates who completed this scheduled interview.
            </p>
          </div>
        </div>
        <CandidateList
          candidates={candidates}
          jobPosition={interview_detail?.jobPosition}
        />
      </div>
    </div>
  );
}

export default InterviewDetailContainer;
