import express from 'express'
import cors from 'cors'
import authRoute from './routes/auth.route.js'
import cookieParser from 'cookie-parser';
import interviewRoute from './routes/interview.route.js'
const app = express();

// app.use(cors());
app.use(express.json());
app.use(cookieParser())


app.use("/api/auth",authRoute);
app.use("/interview",interviewRoute);

export default app;
