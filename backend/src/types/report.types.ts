import mongoose from "mongoose";

export interface IQuestionAnswer{
    question:string;
    intention:string;
    answer:string;
}


export interface IReport{
    _Id:mongoose.Types.ObjectId;
    resume:string;
    jobDescription:string;
    selfDescription:string;
    score:number;
    technicalQuestions:IQuestionAnswer[];
    behaviouralQuestions:IQuestionAnswer[];
    skillGaps:string[];
}


export interface AIReport {
    score: number;
    technicalQuestions: {
        question: string;
        intention: string;
        answer: string;
    }[];
    behaviouralQuestions: {
        question: string;
        intention: string;
        answer: string;
    }[];
    skillGaps: string[];
}