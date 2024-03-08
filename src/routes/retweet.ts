import express from "express";
import { PrismaClient } from '@prisma/client'
import { verifyToken } from "../utils/auth";
const prisma = new PrismaClient()
const router= express.Router();

router.post("/:tweetid",verifyToken,async(req,res)=>{
    const {tweetid}=req.params;
    const userid=req.user.id;
    let retweeted=await prisma.reTweet.findFirst({
        where:{
            tweetId:parseInt(tweetid),
            retweetby:userid
        }
    });
    if(retweeted!=null){
        return res.send("Already Retweeted!");
    }
    let result=await prisma.reTweet.create({
        data:{
            tweetId:parseInt(tweetid),
            retweetby:userid
        }
    });
    await prisma.tweet.update({
        where:{
            id:parseInt(tweetid)
        },
        data:{
            retweetCount:{increment:1}
        }
    });
    res.send({result});
})

router.delete("/:tweetid",verifyToken,async(req,res)=>{
    const{tweetid}=req.params;
    const userid=req.user.id;
    let retweet=await prisma.reTweet.findFirst({
        where:{
            tweetId:parseInt(tweetid),
            retweetby:userid
        }
    })
    if(retweet!=null){
        let response=await prisma.reTweet.delete({
            where:{
                id:parseInt(tweetid),
                retweetby:userid
            }
        });
        await prisma.tweet.update({
            where:{
                id:parseInt(tweetid)
            },
            data:{
                retweetCount:{decrement:1}
            }
        });
        res.send("Retweet deleted");
    }
    res.send("retweet does not exist");
})

export default router;