import mongoose , {Model} from "mongoose";
import { IReport } from "../types/report.types.js";
import { IQuestionAnswer } from "../types/report.types.js";

const questionAnswerSchema = new mongoose.Schema<IQuestionAnswer>({
    question:{
        type:String,
        required:true
    },
    intention:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    }
})

const reportSchema = new mongoose.Schema<IReport>({
    resume: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    selfDescription: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    technicalQuestions:{
        type:[questionAnswerSchema],
        required:true
    },
    behaviouralQuestions:{
        type:[questionAnswerSchema],
        required:true
    },
    skillGaps:{
        type:[String],
        required:true
    }
})

const ReportModel = (mongoose.models.ReportModel as Model<IReport>) || mongoose.model<IReport>("ReportModel",reportSchema);

export default ReportModel;