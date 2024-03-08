-- CreateTable
CREATE TABLE "ReTweet" (
    "id" SERIAL NOT NULL,
    "retweetby" INTEGER NOT NULL,
    "tweetId" INTEGER NOT NULL,

    CONSTRAINT "ReTweet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReTweet" ADD CONSTRAINT "ReTweet_retweetby_fkey" FOREIGN KEY ("retweetby") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReTweet" ADD CONSTRAINT "ReTweet_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
