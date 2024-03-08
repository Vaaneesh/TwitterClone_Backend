import express from "express";
import { PrismaClient } from '@prisma/client'
import { verifyToken } from "../utils/auth";
const prisma = new PrismaClient()
const router= express.Router();

router.post("/",verifyToken,async(req,res)=>{
    const {title,content}=req.body;
    const userid=req.user.id;
    let tweet=await prisma.tweet.create({
        data:{
            title,
            content,
            userid
        }
    })
    res.send({tweet});
})
//all tweets
router.get("/",async(req,res)=>{
    try{
        const tweets=await prisma.tweet.findMany({
            select:{
                user:{
                    select:{
                        firstName:true,
                        lastName:true
                    }
                },
                title:true,
                content:true,
            }
        });
        const alltweets=tweets.map(tweet=>({
            firstname:tweet.user.firstName,
            lastname:tweet.user.lastName,
            title:tweet.title,
            content:tweet.content
        }));
        res.json(alltweets);
    }catch(error){
        console.log(error);
    }
})
//delete
router.delete("/:tweetId",verifyToken,async(req,res)=>{
    try{
        const{tweetId}=req.params;
        const userId=req.user.id;
        const tweet=await prisma.tweet.findFirst({
            where:{
                id:parseInt(tweetId),
                userid:userId
            }
        });
        if(!tweet){
            return res.json("tweet not found or access denied");
        }
        await prisma.tweet.delete({
            where:{
                id:parseInt(tweetId)
            }
        });
        res.json("Tweet deleted successfully");
    }
    catch(error){
        console.log(error);
    }
})
//single Tweet
router.get("/:tweetId",async(req,res)=>{
    try{
        const tweetId=req.params.tweetId;
        const parseId=parseInt(tweetId);
        const tweet=await prisma.tweet.findUnique({
            where:{
                id:parseId,
            },
            select:{
                title:true,
                content:true,
                user:{
                    select:{
                        firstName:true,
                        lastName:true
                    }
                },
            }
        });
        if(!tweet){
            res.json("Wrong id");
        }
        res.json({
            title:tweet?.title,
            content:tweet?.content,
            user:tweet?.user
        });
    }catch(error){
        console.log(error); 
    }
})
//update
router.put("/:tweetId",verifyToken,async(req,res)=>{
    try{
        const {tweetId}=req.params;
        const userId=req.user.id;
        const tweet=await prisma.tweet.findFirst({
            where:{
                id:parseInt(tweetId),
                userid:userId
            }
        });
        if(!tweet){
            return res.json("Tweet not found! or access denied");
        }
        const{title,content}=req.body;
        const updatedTweet=await prisma.tweet.update({
            where:{
                id:parseInt(tweetId)
            },
            data:{
                title,
                content
            }
        });
        res.json(updatedTweet);
    }catch(error){
        console.log(error);
    }
})


export default router;