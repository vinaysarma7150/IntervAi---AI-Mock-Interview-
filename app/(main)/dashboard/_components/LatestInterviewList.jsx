"use client"
import React, { useEffect, useState } from "react"
import { Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/app/provider"
import { supabase } from "@/services/supabaseClient"
import InterviewCard from "./InterviewCard"
import Link from "next/link"

function LatestInterviewList() {
  

  const [interviewList, setInterviewList] = useState([])
  const {user}  = useUser();
  useEffect( ()=>{
    user&&GetInterviewList()
  },[user])

  const GetInterviewList = async() =>{
    let {data:Interviews,error} = await supabase
        .from('Interviews')
        .select('*')
        .eq('userEmail',user?.email)
        .order('id',{ascending:false})
        .limit(4)

        console.log(Interviews)
        setInterviewList(Interviews)
  }








  return (
    <div className="my-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-bold text-2xl">Recently Created Interviews</h2>
        <Button asChild variant="outline">
          <Link href="/all-interview">View All</Link>
        </Button>
      </div>

      {interviewList.length === 0 && (
        <div className="mt-5 flex flex-col items-center gap-3 p-5">
          <Video className="h-10 w-10 text-primary" />
          <h2>You don't have any interview created!</h2>
          <Button asChild>
            <Link href="/dashboard/create-interview">+ Create New Interview</Link>
          </Button>
        </div>
      )}

      {interviewList.length > 0 && (
        <>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {interviewList.map((interview) => (
              <InterviewCard interview={interview} key={interview?.interview_id} />
            ))}
          </div>

          <div className="mt-5 flex justify-center">
            <Button asChild size="sm" variant="outline" className="rounded-lg">
              <Link href="/all-interview">View All Interviews</Link>
            </Button>
          </div>
        </>
      )}

    </div>
  )
}

export default LatestInterviewList
