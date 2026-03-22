import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {

    const {conversation} = await req.json();


    const FINAL_PROMPT =  `
{{conversation}}

Depends on this Interview Conversation between assistant and user, give feedback for the user interview.

Give rating out of 10 for:
- Technical Skills
- Communication
- Problem Solving
- Experience

Also give:
- Summary in 3 lines about the interview

Return the response in JSON format:

{
  feedback: {
    rating: {
      technicalSkills: 5,
      communication: 6,
      problemSolving: 4,
      experience: 7
    },
    summary: "<in 3 lines>"
  }
}
`.replace('{{conversation}}', JSON.stringify(conversation));



  const apiKey = process.env.GEMINI_API_KEY?.trim();


    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }
    const genAI = new GoogleGenerativeAI(apiKey);

    const candidateModels = ["gemini-2.5-flash"];
    let text = "";
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(FINAL_PROMPT);
        const response = await result.response;
        text = response.text();
        break;
      } catch (error) {
        lastError = error;
      }
    }


 return NextResponse.json({
      result: text,
    });





}
