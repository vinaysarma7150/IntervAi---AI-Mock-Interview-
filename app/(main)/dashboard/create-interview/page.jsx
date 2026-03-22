"use client"
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import FormContainer from './_components/FormContainer';
import QuestionList from './_components/QuestionList';
import InterviewLink from './_components/InterviewLink';


function createInterview() {
    const router = useRouter();

    const [interviewId,setInterviewId] = useState();

    const [step,setStep] = useState(1);
    const [formData,setFormData] = useState();
    const onHandleInputChange= (field,value) =>{
        setFormData(
            p=>({
                ...p,
                [field] : value
            })
        )

        console.log(formData)
    }




    const onCreateLink = (interview_id) =>{
        setInterviewId(interview_id);
        setStep((prev) => prev + 1);

    }

    const onStartNewInterview = () => {
        setInterviewId(undefined);
        setFormData(undefined);
        setStep(1);
    }



  return (
    <div className='px-6 md:px-12 lg:px-20 xl:px-28'>
        <div className='flex items-center gap-5'> 
            <ArrowLeft onClick={ ()=> router.back()} className='cursor-pointer text-foreground'/>
            <h2 className='text-xl font-bold text-foreground'> Create Interview</h2>
        </div>

        <Progress value={step * 33.33} className="my-5 bg-muted dark:bg-[#163157]"/>
      {step == 1 ? (
        <FormContainer
            onHandleInputChange={onHandleInputChange}
            GoToNext={() => setStep(step + 1)}
        />
): step ==2? <QuestionList formData= {formData}  onCreateLink = {onCreateLink} /> : step ==3? <InterviewLink interview_id = {interviewId}  formData = {formData} onStartNewInterview={onStartNewInterview}/> : null}
    </div>
  )
}

export default createInterview
