"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BriefcaseBusiness } from "lucide-react";
import React from "react";

function ScoreRow({ label, value }) {
  const numericValue = Number(value) || 0;
  const width = `${Math.max(0, Math.min(100, (numericValue / 10) * 100))}%`;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-card-foreground">{label}</p>
        <p className="text-sm font-semibold text-blue-600">{numericValue}/10</p>
      </div>
      <div className="h-2 w-full rounded-full bg-muted dark:bg-[#163157]">
        <div
          className="h-2 rounded-full bg-blue-600 transition-all"
          style={{ width }}
        />
      </div>
    </div>
  );
}

function getFeedbackPayload(candidateFeedback) {
  return candidateFeedback?.feedback || candidateFeedback || {};
}

function getAverageScore(rating) {
  if (!rating || typeof rating !== "object") {
    return null;
  }

  const values = Object.values(rating)
    .map((value) => Number(value))
    .filter((value) => !Number.isNaN(value));

  if (!values.length) {
    return null;
  }

  const total = values.reduce((sum, value) => sum + value, 0);
  return (total / values.length).toFixed(1);
}

function getQuestionFeedbackList(questionFeedback) {
  if (!Array.isArray(questionFeedback)) {
    return [];
  }

  return questionFeedback.filter(
    (item) => item && (item.question || item.feedback || item.score !== undefined)
  );
}

function CandidateFeedbackDialog({ candidate, jobPosition }) {
  const feedbackPayload = getFeedbackPayload(candidate?.feedback);
  const rating = feedbackPayload?.rating || {};
  const summary =
    feedbackPayload?.summary || "No performance summary is available.";
  const recommendation =
    feedbackPayload?.recommendation || "No recommendation available.";
  const recommendationMsg =
    feedbackPayload?.recommendationMsg || "No recommendation message is available.";
  const questionFeedbackList = getQuestionFeedbackList(feedbackPayload?.questionFeedback);
  const averageScore = getAverageScore(rating);
  const initials = candidate?.userName
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Dialog>
      <DialogTrigger className="h-auto px-0 text-sm font-semibold text-blue-600 hover:underline">
        View Report
      </DialogTrigger>

      <DialogContent className="max-w-4xl border border-border bg-card p-6 text-card-foreground shadow-2xl dark:border-white/8 dark:bg-[#0b1422]/98 dark:shadow-[0_28px_80px_rgba(2,8,23,0.65)] sm:p-8">
        <DialogHeader className="space-y-0">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 via-cyan-400 to-emerald-400 text-base font-bold text-white">
                {initials || "NA"}
              </div>

              <div>
                <DialogTitle className="text-3xl font-bold text-card-foreground">
                  {candidate?.userName || "Unknown Candidate"}
                </DialogTitle>
                <DialogDescription className="mt-2 flex items-center gap-2 text-base text-muted-foreground">
                  <BriefcaseBusiness className="h-4 w-4" />
                  {jobPosition || "Interview Position"}
                </DialogDescription>
              </div>
            </div>

            <div className="text-right">
              <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                {averageScore || "N/A"}
                {averageScore ? <span className="ml-1 text-2xl text-muted-foreground">/10</span> : null}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-card-foreground">Skills Assessment</h3>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              <ScoreRow label="Technical Skills" value={rating?.technicalSkills} />
              <ScoreRow label="Communication" value={rating?.communication} />
              <ScoreRow label="Problem Solving" value={rating?.problemSolving} />
              <ScoreRow label="Experience" value={rating?.experience} />
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-card-foreground">Performance Summary</h3>

            <div className="mt-4 rounded-2xl border border-border bg-muted/40 p-6 text-base leading-8 text-muted-foreground dark:border-white/8 dark:bg-[#11203a]/82">
              {summary}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-card-foreground">Hiring Recommendation</h3>

            <div className="mt-4 rounded-2xl border border-border bg-muted/40 p-6 dark:border-white/8 dark:bg-[#11203a]/82">
              <p className="text-lg font-semibold text-card-foreground">{recommendation}</p>
              <p className="mt-2 text-base leading-7 text-muted-foreground">
                {recommendationMsg}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-card-foreground">Question-wise Feedback</h3>

            {questionFeedbackList.length ? (
              <div className="mt-5 space-y-4">
                {questionFeedbackList.map((item, index) => (
                  <div
                    key={`${item?.question || "question"}-${index}`}
                    className="rounded-2xl border border-border bg-muted/40 p-5 dark:border-white/8 dark:bg-[#11203a]/82"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-200">
                          Question {index + 1}
                        </p>
                        <p className="mt-2 text-base font-semibold leading-7 text-card-foreground">
                          {item?.question || "Question text unavailable"}
                        </p>
                      </div>

                      <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-[#163157] dark:text-blue-200">
                        {Number(item?.score) || 0}/10
                      </div>
                    </div>

                    <div className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                      {item?.feedback || "No detailed feedback available for this question."}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground dark:border-white/10 dark:bg-[#11203a]/60">
                Question-wise feedback is not available for this submission.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CandidateFeedbackDialog;
