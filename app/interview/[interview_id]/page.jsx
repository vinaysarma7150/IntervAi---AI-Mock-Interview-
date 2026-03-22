"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import { supabase } from "@/services/supabaseClient";
import { Clock3, Info, Loader2Icon, Video } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

function Interview() {


  const router = useRouter();
  const {interview_id} = useParams();

  const [interviewData, setInterviewData] = useState();

  const [userName,setUserName] = useState();

    const [userEmail,setUserEmail] = useState();


  const [loading,setLoading]  =useState(true);

  const {interviewInfo, setInterviewInfo} = useContext(InterviewDataContext)




  const onJoinInterview = async () =>{

    setLoading(true);

    console.log("inside onJoin")

      let {data:Interviews, error} = await supabase
                        .from('Interviews')
                        .select('*')
                        .eq('interview_id',interview_id)
      console.log(Interviews[0])

      setInterviewInfo({
        userName: userName,
        userEmail: userEmail,
        interviewData : Interviews[0]
      })

      // console.log("skdjfksdf" ,interviewInfo)
      
      router.push('/interview/' + interview_id + '/start')

    setLoading(false);



  }


  // console.log(interview_id)

  useEffect( () =>{

    {interview_id&&GetInterviewDetails()}
  },[interview_id])

  const GetInterviewDetails = async () =>{

    setLoading(true);

    try{

      let {data:Interviews, error} = await supabase
      .from('Interviews')
      .select("jobPosition,jobDescription,duration,type")
      .eq('interview_id',interview_id)
      // console.log(Interviews[0])
  
      setInterviewData(Interviews[0])
  
      // console.log("welhfh" ,interviewData)
  
      setLoading(false);
      if(Interviews?.length== 0){
            toast("Invalid Link!")
      }
    }
    catch(e){
              toast("qw.elfr,kuwekif")

    }

  }



  return (
    <div className="px-4 pb-8 pt-5 sm:px-6 md:px-10">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center rounded-[24px] border border-border bg-card px-5 py-6 text-card-foreground shadow-sm dark:border-white/10 dark:bg-[#11203a]/94 dark:shadow-[0_24px_60px_rgba(2,8,23,0.58)]">
        <Image
          src="/logo-whitebg.png"
          alt="logo"
          width={220}
          height={100}
          className="h-auto w-[130px] dark:hidden sm:w-[155px]"
          priority
        />
        <Image
          src="/logo.jpeg"
          alt="logo"
          width={220}
          height={100}
          className="hidden h-auto w-[130px] dark:block sm:w-[155px]"
          priority
        />

        <h2 className="mt-2 text-center text-sm font-medium text-muted-foreground sm:text-base">
          AI-Powered Interview Platform
        </h2>

        <Image
          src="/interview.png"
          alt="interview illustration"
          width={500}
          height={500}
          className="my-4 h-auto w-[180px] sm:w-[220px]"
          priority
        />

        <h1 className="text-center text-xl font-bold tracking-tight text-card-foreground sm:text-[1.75rem]">
          {interviewData?.jobPosition}
         
        </h1>

        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground sm:text-base">
          <Clock3 className="h-4 w-4" />
          {interviewData?.duration}
        </p>

        <div className="mt-5 w-full max-w-[440px]">
          <label className="mb-2 block text-sm font-medium text-card-foreground">
            Enter your full name
          </label>
          <Input
            placeholder="Full name"
            className="h-11 rounded-xl border-border bg-background/80 px-4 text-sm dark:border-white/10 dark:bg-[#0b1425]"
            onChange = { (e) => setUserName(e.target.value)}
          />
        </div>

         <div className="mt-5 w-full max-w-[440px]">
          <label className="mb-2 block text-sm font-medium text-card-foreground">
            Enter your email
          </label>
          <Input
            placeholder="name@gmail.com"
            className="h-11 rounded-xl border-border bg-background/80 px-4 text-sm dark:border-white/10 dark:bg-[#0b1425]"
            onChange = { (e) => setUserEmail(e.target.value)}
          />
        </div>

        <div className="mt-5 w-full max-w-[440px] rounded-[20px] border border-blue-200/70 bg-blue-50 px-4 py-4 dark:border-blue-400/20 dark:bg-[#0f2547]">
          <div className="flex items-start gap-4">
            <div className="rounded-full border-2 border-blue-500 p-1 text-blue-600">
              <Info className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-card-foreground">Before you begin</h2>
              <ul className="mt-2.5 space-y-1 text-sm text-blue-600 dark:text-blue-200">
                <li>- Test your camera and microphone</li>
                <li>- Ensure you have a stable internet connection</li>
                <li>- Find a quiet place for interview</li>
              </ul>
            </div>
          </div>
        </div>

        <Button className="mt-5 h-11 w-full max-w-[440px] rounded-xl text-sm font-semibold cursor-pointer"
        disabled = {loading || !userName}
        onClick = { () => {onJoinInterview()}}
        >
          {loading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
          Join Interview
        </Button>
      </div>
    </div>
  );
}

export default Interview;
