import express from "express";
import { PrismaClient } from '@prisma/client'
import { createJwtToken, verifyToken } from "../utils/auth";
const prisma = new PrismaClient()
const router= express.Router();

router.post("/:id",verifyToken,async(req,res)=>{
    const {id}=req.params;
    const userid=req.user.id;
    let like= await prisma.like.findFirst({
        where:{
            tweetid:Number(id),
            userId:userid
        }
    })
    if(like!=null){
        await prisma.like.delete({
            where:{
                id:like.id
            }
        });
        await prisma.tweet.update({
            where:{
                id:Number(id)
            },
            data:{
                likecount:{decrement:1}
            }
        })
        return res.send("tweet dislike")
    }
    await prisma.like.create({
        data:{
            tweetid:parseInt(id),
            userId:userid
        }
    });
    await prisma.tweet.update({
        where:{
            id:parseInt(id)
        },
        data:{
            likecount:{
                increment:1
            }
        }
    })
    return res.send("tweet liked!");
})
router.get("/:id",verifyToken,async(req,res)=>{
    const {id}=req.params;
    let like=await prisma.like.findMany({
        where:{
            tweetid:parseInt(id)
        },
        select:{
            user:true
        }
    });
    res.send({like});
})


export default router;