"use client"
import { useUser } from '@/app/provider';
import { supabase } from '@/services/supabaseClient';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import InterviewDetailContainer from './_components/InterviewDetailContainer';

function InterviewDetails() {

    const params = useParams();
    const interviewId = params?.["interview-id"];
    const {user} = useUser();
    const [interviewDetails,setInterviewDetails] = useState(null);
    

    useEffect(()=>{

        if (user && interviewId) {
          GetInterviewDetails()
        }
    },[user, interviewId])

    const GetInterviewDetails = async ()=>{
        const { data: Interviews } = await supabase
              .from("Interviews")
              .select(`jobPosition,jobDescription,type,duration,questionList,created_at,
                 interview-feedback(userEmail,userName,feedback,created_at)`)
              .eq("userEmail", user?.email)
              .eq('interview_id', interviewId)

              console.log(Interviews)
              setInterviewDetails(Interviews?.[0] || null)
    }

    
  return (
    <div className="rounded-[28px] border border-transparent p-1 dark:border-white/5">
      <h2 className='text-2xl font-bold text-foreground'>Interview Details</h2> 
      <InterviewDetailContainer interview_detail={interviewDetails} />
    </div>
  )
}

export default InterviewDetails
