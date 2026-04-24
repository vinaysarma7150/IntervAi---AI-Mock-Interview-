"use client";
import { useUser } from "@/app/provider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import InterviewCard from "../dashboard/_components/InterviewCard";

function ScheduledInterview() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    if (user) {
      getInterviewList();
    }
  }, [user]);

  const getInterviewList = async () => {
    const { data: Interviews } = await supabase
      .from("Interviews")
      .select("*, interview-feedback(userEmail)")
      .eq("userEmail", user?.email)
      .order("id", { ascending: false });

    setInterviewList(Interviews || []);
  };

  return (
    <div className="my-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Scheduled Interviews</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review scheduled interviews and track candidate responses.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {interviewList.length === 0 && (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/70 p-8 text-center shadow-sm dark:border-white/10 dark:bg-[#11203a]/80">
          <Calendar className="h-10 w-10 text-primary" />
          <h2 className="text-lg font-semibold">No scheduled interviews found</h2>
          <p className="text-sm text-muted-foreground">
            Create an interview and share it with candidates to see it here.
          </p>
          <Button asChild>
            <Link href="/dashboard/create-interview">+ Create New Interview</Link>
          </Button>
        </div>
      )}

      {interviewList.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {interviewList.map((interview) => (
            <InterviewCard
              interview={interview}
              key={interview?.interview_id}
              viewDetails={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ScheduledInterview;
