"use client";

import { Button } from "@/components/ui/button";
import { Check, MoveRight, Send } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

function InterviewComplete() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#00c53b] text-black shadow-sm">
          <Check className="h-10 w-10 stroke-[3]" />
        </div>

        <h1 className="mt-5 text-center text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Interview Complete!
        </h1>

        <p className="mt-2 max-w-2xl text-center text-base text-muted-foreground sm:text-lg">
          Thank you for participating in the AI-driven interview with AIcruiter.
        </p>

        <div className="mt-6 w-full max-w-2xl overflow-hidden rounded-[24px] border border-border bg-card shadow-[0_18px_35px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[#11203a]/92">
          <Image
            src="/complete.avif"
            alt="Interview completed"
            width={1400}
            height={900}
            priority
            className="h-[170px] w-full object-cover sm:h-[210px] lg:h-[240px]"
          />
        </div>

        <div className="mt-6 w-full max-w-2xl rounded-[24px] border border-border bg-card px-5 py-8 text-center text-card-foreground shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#11203a]/92 sm:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm">
            <Send className="h-6 w-6" />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-card-foreground">What&apos;s Next?</h2>

          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The recruiter will review your interview responses and will contact
            you soon regarding the next steps.
          </p>

          <Button
            size="lg"
            className="mt-6 h-10 rounded-xl px-5 text-sm font-semibold"
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
            <MoveRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InterviewComplete;
