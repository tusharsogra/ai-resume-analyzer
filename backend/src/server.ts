import app from './app.js'
import dotenv from 'dotenv'
import connectDb from './config/db.js';
dotenv.config();

const port = process.env.PORT || 3000;


app.listen(port , async()=>{
    console.log(`server is started on http://localhost:${port}`)
    await connectDb();
})