import express from 'express'
import { trainingSchema,generateImage,generateImagesForPack } from '@repo/common/types';

import {prismaClient as prisma} from "@repo/db/client"


const app = express();


app.listen(3000,()=>{
    console.log("App is listening to port 3000");
})