import { Button } from "@/components/ui/button";
import { Clock3, Copy } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

function InterviewCard({ interview, viewDetails = false }) {
  const createdAtLabel = interview?.created_at
    ? new Date(interview.created_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Date unavailable";
  const interviewLink = `/interview/${interview?.interview_id}`;
  const detailsLink = `/scheduled-interview/${interview?.interview_id}/details`;
  const candidateCount = interview?.["interview-feedback"]?.length ?? 0;

  const handleCopyLink = async () => {
    try {
      const fullLink = `${window.location.origin}${interviewLink}`;
      await navigator.clipboard.writeText(fullLink);
      toast("Interview link copied");
    } catch (error) {
      console.log("copy link error:", error);
      toast("Unable to copy interview link");
    }
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm dark:border-white/8 dark:bg-[#101a2c]/92">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-lg font-bold text-card-foreground">
            {interview?.jobPosition || "Interview"}
          </h3>
          {!viewDetails ? (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {interview?.jobDescription || "No description available."}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4" />
          <span>{interview?.duration || "Duration not set"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-card-foreground">Created:</span>
          <span>{createdAtLabel}</span>
        </div>
        {viewDetails ? (
          <div className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:text-emerald-400 dark:ring-emerald-500/20">
            Candidates: {candidateCount}
          </div>
        ) : null}
      </div>

      {viewDetails ? (
        <div className="mt-auto pt-5">
          <Button asChild className="h-11 w-full rounded-xl text-sm font-semibold">
            <Link href={detailsLink}>View Details</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-auto flex gap-3 pt-5">
          <Button asChild className="rounded-xl">
            <Link href={interviewLink}>View Interview</Link>
          </Button>
          <Button variant="outline" className="rounded-xl" onClick={handleCopyLink}>
            <Copy className="h-4 w-4" />
            Copy Link
          </Button>
        </div>
      )}
    </div>
  );
}

export default InterviewCard;
