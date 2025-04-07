import express from 'express'
import { trainingSchema,generateImage,generateImagesForPack } from '@repo/common/types';

import {prismaClient as prisma} from "@repo/db/client"

const PORT = 8080
const app = express();


app.use(express.json());


app.post("/ai/training",async (req,res)=>{
    try{
        const parsedBody = trainingSchema.safeParse(req.body);

        if(!parsedBody.success){
            res.status(411).json({
                msg:"Invalid inputs"
            })
            return;
        }
    
    
        const response = await prisma.model.create({
            data:{
                name:parsedBody.data.name,
                type:parsedBody.data.type,
                age:parsedBody.data.age,
                bald:parsedBody.data.bald,
                eyeColor:parsedBody.data.eyeColor,
                ethnicity:parsedBody.data.ethnicity,
                userId:req.userId!
            }
        })
    
        res.status(201).json({
            msg:"Model successfully added",
            modelId:response.id
        })
    }catch(e){
        console.error(e);
        res.status(500).json({
            msg:"Model request unsuccesful"
        })
        return;
        
    }
})

app.post("/ai/generate",async (req,res)=>{
    try{
        const parsedBody = generateImage.safeParse(req.body);

        if(!parsedBody.success){
            res.status(411).json({
                msg:"Invalid inputs"
            })
            return;
        }
    
        const response = await prisma.outputImage.create({
            data:{
                status:'Pending',
                prompt:parsedBody.data.prompt,
                modelId:parsedBody.data.modelId,
                userId:req.userId!
                
            }
        })
    
        res.status(201).json({
            msg:"Successfully started to generate the image",
            imageId:response.id
        })
        return;
        
    }
    catch(e){
        res.status(500).json({
            msg:"Unsucessful generate image request"
        })
        return;

    }


})



app.post("/pack/generate",async(req,res)=>{
    try{
        const parsedBody = generateImagesForPack.safeParse(req.body);

        if(!parsedBody.success){
            res.status(411).json({
                msg:"Invalid inputs"
            })
            return;
    
        }
    
        const validPrompts = await prisma.packPrompts.findMany({
            where:{
                packId:parsedBody.data.packId
            }
        })
    
    
        const response = await prisma.outputImage.createManyAndReturn({
            data:validPrompts.map((prompt)=>({
                status:'Pending',
                prompt:prompt.prompt,
                modelId:parsedBody.data.modelId,
                userId:req.userId!
                
                
            }))
        })
    
        res.status(200).json({
            msg:"Pack images generated successfully",
            images:response.map((image)=>image.id)
        })
        return;
    }
    catch(e){
        console.error(e);
        res.status(500).json({
            msg:"Pack images request unsuccesful"
        })
    }

})


app.get("/packs/bulk",async (req,res)=>{
    try{

        const response = await prisma.pack.findMany({});
        res.status(200).json({
            msg:"Pack bulk request successful",
            response
        })
        return;
    }
    catch(e){
        console.error(e);
        res.status(500).json({
            msg:"Pack bulk reqeust unsuccessful"
        })
    }
})


app.get("/image/bulk",async (req,res)=>{

    try{
        const images = req.query.images as string[]
        const limit = req.query.limit as string;
        const offset = req.query.offset as string;

        const imageData = await prisma.outputImage.findMany({
            where:{
                id:{in:images},
                userId:req.userId
            },
            skip:parseInt(limit),
            take:parseInt(offset)
        })

        res.status(200).json({
            msg:"Bulk image GET request succesful"
        })
        return

    }
    catch(e){
        res.status(500).json({
            msg:"Bulk image GET request unsuccesful"
        })
        return;

    }


})

app.listen(PORT,()=>{
    console.log(`App is listening to port ${PORT}`);
})