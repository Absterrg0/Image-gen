import {z} from 'zod';



export const trainingSchema = z.object({
    name:z.string(),
    type:z.enum(["Man","Woman","Other"]),
    age:z.number(),
    ethnicity:z.enum([
        "White",
        "Black",
        "Asian",
        "American"
    ]),
    eyeColor:z.enum([
        "Brown",
        "Blue",
        "Black",
        "Hazel"
    ]),
    bald:z.boolean(),
    images:z.array(z.string())

})





export const generateImage = z.object({
    prompt:z.string(),
    modelId:z.string(),
    number:z.number()
})



export const generateImagesForPack = z.object({
    modelId:z.string(),
    packId:z.string()
})