"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Link2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import CandidateFeedbackDialog from "./CandidateFeedbackDialog";

function getAverageScore(feedback) {
  const rating = feedback?.feedback?.rating || feedback?.rating;

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

function CandidateList({ candidates, jobPosition }) {
  const [expandedEmails, setExpandedEmails] = useState({});
  const groupedCandidates = useMemo(() => {
    const safeCandidates = candidates || [];
    const grouped = safeCandidates.reduce((acc, candidate) => {
      const email = candidate?.userEmail || "unknown-email";

      if (!acc[email]) {
        acc[email] = [];
      }

      acc[email].push(candidate);
      return acc;
    }, {});

    return Object.entries(grouped);
  }, [candidates]);

  if (!candidates?.length) {
    return (
      <div className="mt-5 rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground dark:border-white/10 dark:bg-[#11203a]/60">
        No candidate responses yet.
      </div>
    );
  }

  const toggleEmail = (email) => {
    setExpandedEmails((prev) => ({
      ...prev,
      [email]: !prev[email],
    }));
  };

  return (
    <div className="mt-5 space-y-3">
      <h4 className="text-base font-semibold text-card-foreground">
        Candidates ({groupedCandidates.length})
      </h4>

      {groupedCandidates.map(([email, feedbackList], groupIndex) => {
        const firstCandidate = feedbackList[0];
        const initials = firstCandidate?.userName
          ?.split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        const isExpanded = expandedEmails[email];

        return (
          <div
            key={`${email}-${groupIndex}`}
            className="rounded-2xl border border-border bg-background/60 shadow-sm backdrop-blur-sm dark:border-white/8 dark:bg-[#11203a]/82"
          >
            <button
              type="button"
              onClick={() => toggleEmail(email)}
              className="flex w-full flex-col gap-4 px-4 py-4 text-left sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 via-cyan-400 to-emerald-400 text-sm font-bold text-white">
                  {initials || "NA"}
                </div>

                <div>
                  <p className="text-base font-semibold text-card-foreground">
                    {firstCandidate?.userName || "Unknown Candidate"}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Link2 className="h-4 w-4" />
                    <span>{email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6">
                <p className="rounded-full bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground dark:bg-[#163157] dark:text-slate-200">
                  {feedbackList.length} submission{feedbackList.length > 1 ? "s" : ""}
                </p>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {isExpanded ? (
              <div className="space-y-3 border-t border-border bg-muted/20 px-4 py-4 dark:border-white/8 dark:bg-black/10">
                {feedbackList.map((candidate, index) => {
                  const score = getAverageScore(candidate?.feedback);
                  const submittedOn = candidate?.created_at
                    ? new Date(candidate.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A";

                  return (
                    <div
                      key={`${candidate?.created_at || "feedback"}-${index}`}
                      className="flex flex-col gap-4 rounded-2xl border border-border bg-card px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/8 dark:bg-[#0d1626]"
                    >
                      <div>
                        <p className="text-base font-semibold text-card-foreground">
                          Feedback {index + 1}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <Link2 className="h-4 w-4" />
                          <span>Completed on {submittedOn}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:gap-6">
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {score ? `${score}/10` : "N/A"}
                        </p>

                        <CandidateFeedbackDialog
                          candidate={candidate}
                          jobPosition={jobPosition}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default CandidateList;
