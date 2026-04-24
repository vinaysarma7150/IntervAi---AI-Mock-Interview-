
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';
import React, { useEffect,useState } from 'react'
import QuestionListContainer from './QuestionListContainer';
import {v4 as uuidv4} from  'uuid';
import { supabase } from '@/services/supabaseClient';
import { useUser } from '@/app/provider';

function QuestionList({formData, onCreateLink}) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [questionList,setQuestionList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [saveLoading,setSaveLoading] = useState(false);
    
    useEffect( () =>{
        if(formData){
            GenerateQuestionList();
        }
    },[formData])
    

    const GenerateQuestionList = async () => {
      setLoading(true);
      setErrorMessage("");
      try{
        const result  = await axios.post('/api/ai-model', {
          ...formData
        })
        const rawContent = result.data?.result ?? "";
        const cleanedContent = rawContent
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();


        const parsedContent = JSON.parse(cleanedContent);
        const questions = Array.isArray(parsedContent?.questions)
          ? parsedContent.questions
          : [];
        const selectedTypes = Array.isArray(formData?.type)
          ? formData.type
          : formData?.type
            ? [formData.type]
            : [];
        const formattedQuestions = questions.map((question) => ({
          question,
          type: selectedTypes,
        }));

        setQuestionList(formattedQuestions);
        setErrorMessage("");
        // console.log(questions);

      }
      catch(e){
        console.log(e)
        console.log(e?.response?.data)
        setQuestionList([]);
        setErrorMessage(
          e?.response?.data?.error || "Failed to generate questions. Please try again."
        );
      }
      finally{
        setLoading(false);
      }
    }





    const onFinish = async () => {

      setSaveLoading(true);
      if (!questionList.length) {
        setSaveLoading(false);
        return;
      }
      const interview_id = uuidv4();

      const { data, error } = await supabase
          .from('Interviews')
          .insert([
            { 
              ...formData,
              questionList,
              userEmail:user?.email,
              interview_id
            },
          ])
          .select();

      if (error) {
        console.log(error);
        setSaveLoading(false);
        return;
      }

      setSaveLoading(false)

      console.log(data);


      onCreateLink(
        interview_id,)








    }





 return (
  <div>

    {loading && (
      <div className="flex items-center gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-500/20 dark:bg-[#0f2547]">

        <Loader2Icon className="animate-spin text-blue-600" size={28} />

        <div>
          <h2 className="font-semibold text-gray-800 dark:text-blue-100">
            Generating Interview Questions
          </h2>

          <p className="mt-1 text-sm text-blue-600 dark:text-blue-300">
            Our AI is crafting personalized questions based on your job position
          </p>
        </div>

      </div>
    )}

    {!loading && errorMessage && (
      <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-[#3a1620] dark:text-red-200">
        {errorMessage}
      </div>
    )}

    {!loading && questionList.length > 0 && (
      <div className="mt-5 rounded-3xl border border-border bg-card p-5 shadow-sm dark:border-white/8 dark:bg-[#101a2c]/92">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">
              Interview Questions
            </h2>
            <p className="text-sm text-muted-foreground">
              Review the generated questions before moving ahead.
            </p>
          </div>

          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-[#163157] dark:text-blue-200">
            {questionList.length} Questions
          </span>
        </div>

        <QuestionListContainer questionList={questionList} />

        <div className="mt-5 flex justify-end ">
          <Button className = "cursor-pointer" onClick={onFinish} disabled={saveLoading}>
            
            {saveLoading && <Loader2Icon className='animate-spin' />}
            
            Create Interview Link & Finish

            </Button>
        </div>
      </div>
    )}

  </div>
);
}
export default QuestionList;
