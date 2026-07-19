import { GoogleGenAI } from "@google/genai";
import z from "zod";
import { AIReport } from "../types/report.types.js";
import { zodToJsonSchema } from "zod-to-json-schema";


export interface IBodyProps {
    resume: string;
    jobDescription: string;
    selfDescription: string;
}
async function generateReport({ resume, jobDescription, selfDescription }: IBodyProps): Promise<AIReport> {

    const googleApiKey = process.env.GEMINI_API_KEY!;
    if (!googleApiKey) {
        throw new Error("provide gemini api key in .env")
    }

    const client = new GoogleGenAI({
        apiKey: googleApiKey
    })

    const interviewReportJsonSchema = z.object({
        technicalQuestions: z
            .array(
                z.object({
                    question: z
                        .string()
                        .describe("Technical interview question that the interviewer may ask."),

                    intention: z
                        .string()
                        .describe("Why the interviewer asks this question and what they are evaluating."),

                    answer: z
                        .string()
                        .describe("A strong sample answer tailored to the candidate's resume and the job description.")
                })
            )
            .min(10)
            .describe("List of technical interview questions."),

        behaviouralQuestions: z
            .array(
                z.object({
                    question: z
                        .string()
                        .describe("Behavioral interview question that the interviewer may ask."),

                    intention: z
                        .string()
                        .describe("Purpose of the question and the qualities being assessed."),

                    answer: z
                        .string()
                        .describe("A strong sample answer using the candidate's experience, preferably in STAR format.")
                })
            )
            .min(10)
            .describe("List of behavioral interview questions."),

        score: z
            .number()
            .min(0)
            .max(100)
            .describe(
                "Overall interview readiness score (0-100) based on the candidate's resume, skills, experience, and alignment with the job description."
            ),

        skillGaps: z
            .array(z.string())
            .describe(
                "List of missing or weak skills that could reduce the candidate's chances of being selected."
            )
    });

    const geminiSchema = zodToJsonSchema(interviewReportJsonSchema);

    const prompt = `
You are an expert technical interviewer.

Generate a JSON interview report.

For EVERY question include:

- question
- intention (Explain WHY the interviewer asks this question and what skill they are evaluating.)
- answer (A detailed sample answer tailored to the candidate.)

Generate:

- 10 technical questions
- 10 behavioural questions
- score (0-100)
- skillGaps

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;


    const response = await client.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: geminiSchema
        }

    })

    const text = response.text;
    if (!text) {
        throw new Error("no output is generate  by the google gemini")
    }

    const textParse = interviewReportJsonSchema.parse(JSON.parse(text));
    console.log(textParse);
    return textParse;
}

export default generateReport;