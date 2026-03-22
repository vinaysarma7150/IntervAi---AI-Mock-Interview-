import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { jobPosition, jobDescription, duration, type } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const normalizedType = Array.isArray(type) ? type.join(", ") : type;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    if (!jobPosition || !jobDescription || !duration || !normalizedType) {
      return NextResponse.json(
        { error: "Missing required interview fields" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = `
    Generate 5 ${normalizedType} interview questions for the following role.
    Job position: ${jobPosition}
    Interview duration: ${duration}
    Job description: ${jobDescription}
    Return questions in JSON format like:
    {
      "questions":[
        "question1",
        "question2"
      ]
    }
      with in the question do not put any symbols because the questions are read by ai
    `;

    const candidateModels = ["gemini-2.5-flash"];
    let text = "";
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        text = response.text();
        break;
      } catch (error) {
        lastError = error;
      }
    }

    if (!text) {
      throw lastError ?? new Error("No response generated");
    }

    return NextResponse.json({
      result: text,
    });
  } catch (error) {
    console.error(error);
    const message =
      error?.message ||
      error?.errorDetails?.map((item) => item.reason).join(", ") ||
      "Failed to generate questions";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
