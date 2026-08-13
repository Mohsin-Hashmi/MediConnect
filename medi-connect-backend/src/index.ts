import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();


const PORT = process.env.PORT || 7000;
const app = express();
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World How are you?');  
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})