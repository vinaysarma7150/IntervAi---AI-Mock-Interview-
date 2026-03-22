"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Clock3, Copy, ExternalLink, List, Mail, MessageCircleMore, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

function InterviewLink({ interview_id, formData, onStartNewInterview }) {
  const [copied, setCopied] = useState(false);

  const interviewUrl = useMemo(() => {
    const hostUrl =
      process.env.NEXT_PUBLIC_HOST_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");

    return `${hostUrl}/${interview_id ?? ""}`;
  }, [interview_id]);

  useEffect(() => {
    setCopied(false);
  }, [interview_id]);

  const questionCount = Array.isArray(formData?.questionList)
    ? formData.questionList.length
    : Number(formData?.interviewQuestions) || 10;

  const duration = formData?.duration || "5 Min";

  const onCopyLink = async () => {
    if (!interview_id || !interviewUrl) {
      return;
    }

    await navigator.clipboard.writeText(interviewUrl);
    setCopied(true);
  };

  const onOpenLink = () => {
    if (!interview_id || !interviewUrl) {
      return;
    }

    window.open(interviewUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-5xl space-y-8 pb-10">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
          <Check className="h-10 w-10" strokeWidth={3} />
        </div>
        <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground">
          Your AI Interview is Ready!
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Share this link with your candidates to start the interview process
        </p>
      </div>

      <div className="w-full rounded-3xl border border-border bg-card p-6 shadow-sm dark:border-white/8 dark:bg-[#101a2c]/92">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-2xl font-semibold text-card-foreground">Interview Link</h3>
          <span className="w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 dark:bg-[#163157] dark:text-blue-200">
            Valid for 30 Days
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Input
            readOnly
            value={interviewUrl}
            className="h-12 rounded-xl border-border text-base text-foreground"
          />
          <div className="flex gap-3">
            <Button variant="outline" className="h-12 rounded-xl px-6" onClick={onOpenLink} disabled={!interview_id}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Open
            </Button>
            <Button className="h-12 rounded-xl px-6" onClick={onCopyLink} disabled={!interview_id}>
              <Copy className="mr-2 h-4 w-4" />
              {copied ? "Copied" : "Copy Link"}
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2 text-lg">
            <Clock3 className="h-5 w-5" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2 text-lg">
            <List className="h-5 w-5" />
            <span>{questionCount} Questions</span>
          </div>
        </div>
      </div>

      <div className="w-full rounded-3xl border border-border bg-card p-6 shadow-sm dark:border-white/8 dark:bg-[#101a2c]/92">
        <h3 className="text-2xl font-semibold text-card-foreground">Share Via</h3>

        <div className="mt-5 flex flex-wrap gap-4">
          <Button variant="outline" className="h-12 rounded-xl px-6">
            <MessageCircleMore className="mr-2 h-4 w-4" />
            Slack
          </Button>
          <Button variant="outline" className="h-12 rounded-xl px-6">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
          <Button variant="outline" className="h-12 rounded-xl px-6">
            <MessageCircleMore className="mr-2 h-4 w-4" />
            Whatsapp
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="outline" className="h-12 rounded-xl px-6">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <Button className="h-12 rounded-xl px-6" onClick={onStartNewInterview}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Interview
        </Button>
      </div>
    </div>
  );
}

export default InterviewLink;
