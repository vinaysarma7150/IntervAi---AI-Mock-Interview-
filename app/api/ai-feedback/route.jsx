import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {

    const {conversation} = await req.json();


    const FINAL_PROMPT =  `
{{conversation}}

Based on this interview conversation between the assistant and the user, evaluate the candidate's interview performance.

Give rating out of 10 for:
- Technical Skills
- Communication
- Problem Solving
- Experience

Also give:
- Summary in exactly 3 concise lines about the interview
- One line telling whether the candidate is recommended for hire
- A short recommendation message
- Feedback for each interview question asked by the assistant

For each question in questionFeedback:
- include the exact or closest question text
- give a score out of 10
- give 2 to 3 lines of feedback focused on the candidate's answer for that specific question

Important:
- Return only valid JSON
- Do not include markdown fences
- Do not include any extra text outside the JSON
- questionFeedback must be an array

Return the response in this JSON format:

{
  "feedback": {
    "rating": {
      "technicalSkills": 5,
      "communication": 6,
      "problemSolving": 4,
      "experience": 7
    },
    "summary": "Line 1\\nLine 2\\nLine 3",
    "recommendation": "Recommended",
    "recommendationMsg": "Strong fundamentals with a few areas to improve.",
    "questionFeedback": [
      {
        "question": "Tell me about yourself.",
        "score": 7,
        "feedback": "You gave a clear introduction with relevant background.\\nYour answer would be stronger with more measurable impact.\\nMentioning one standout project would add more depth."
      }
    ]
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
