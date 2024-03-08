"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = require("../utils/auth");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.post("/", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    const userid = req.user.id;
    let tweet = yield prisma.tweet.create({
        data: {
            title,
            content,
            userid
        }
    });
    res.send({ tweet });
}));
//all tweets
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tweets = yield prisma.tweet.findMany({
            select: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                title: true,
                content: true,
            }
        });
        const alltweets = tweets.map(tweet => ({
            firstname: tweet.user.firstName,
            lastname: tweet.user.lastName,
            title: tweet.title,
            content: tweet.content
        }));
        res.json(alltweets);
    }
    catch (error) {
        console.log(error);
    }
}));
//delete
router.delete("/:tweetId", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tweetId } = req.params;
        const userId = req.user.id;
        const tweet = yield prisma.tweet.findFirst({
            where: {
                id: parseInt(tweetId),
                userid: userId
            }
        });
        if (!tweet) {
            return res.json("tweet not found or access denied");
        }
        yield prisma.tweet.delete({
            where: {
                id: parseInt(tweetId)
            }
        });
        res.json("Tweet deleted successfully");
    }
    catch (error) {
        console.log(error);
    }
}));
//single Tweet
router.get("/:tweetId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tweetId = req.params.tweetId;
        const parseId = parseInt(tweetId);
        const tweet = yield prisma.tweet.findUnique({
            where: {
                id: parseId,
            },
            select: {
                title: true,
                content: true,
                user: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
            }
        });
        if (!tweet) {
            res.json("Wrong id");
        }
        res.json({
            title: tweet === null || tweet === void 0 ? void 0 : tweet.title,
            content: tweet === null || tweet === void 0 ? void 0 : tweet.content,
            user: tweet === null || tweet === void 0 ? void 0 : tweet.user
        });
    }
    catch (error) {
        console.log(error);
    }
}));
//update
router.put("/:tweetId", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tweetId } = req.params;
        const userId = req.user.id;
        const tweet = yield prisma.tweet.findFirst({
            where: {
                id: parseInt(tweetId),
                userid: userId
            }
        });
        if (!tweet) {
            return res.json("Tweet not found! or access denied");
        }
        const { title, content } = req.body;
        const updatedTweet = yield prisma.tweet.update({
            where: {
                id: parseInt(tweetId)
            },
            data: {
                title,
                content
            }
        });
        res.json(updatedTweet);
    }
    catch (error) {
        console.log(error);
    }
}));
exports.default = router;
