require('dotenv').config();
const Twitter = require('twitter')
const TwitterModel = require('./twitter-model');

const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});


module.exports = { 
    
    getAll: async (req, res) => {
        try{
            const tweets = await TwitterModel.get()
            res.status(200).json(tweets);
        } catch (error) {
            res.status(500).json({message: `error getting tweets : ${error}`})
        }
    },
    getTweet: async function(req, res){
        try {
            let id = req.params.id;
            const tweetConfirm = await client.get('statuses/show/', {id})
            console.log(tweetConfirm);
            // const dbTweet = TwitterModel.getSingleTweet(tweetConfirm);
            res.status(200).json({
                message: tweetConfirm
                // message: `Received tweet: ${dbTweet.text} with id ${dbTweet.twitter_id}`
            })
        } catch (error) {
            res.status(500).json({
                message: `unable to get tweet : ${error}`
            })
        }
    },
    postTweet: async function(req, res){
        try {
            const tweet = req.body;
            const tweetConfirm = await client.post('statuses/update', tweet);
            console.log(tweetConfirm);
            // const dbTweet = await TwitterModel.createTweet(tweetConfirm);
            // console.log(dbTweet);
            res.status(200).json({
                message: `New Tweet Created : Id number: ${tweetConfirm.id} with text ${tweetConfirm.text}`
                // message: `New Tweet Created : ${dbTweet.tweet_text}`
            })
        } catch (error) {
            res.status(500).json({
                message: `unable to create tweet : ${error}`
            })
        }
    },
    delTweet: async function(req, res){
        try {
            const delConfirm = await client.post('statuses/destroy', {id})
            const id = TwitterModel.deleteTweet(delConfirm);
            if (id) {
                res.status(200).json({
                    message: `Removed tweet with id : ${id}`
                })
            } else {
                res.status(401).json({
                    message: `Tweet not found with id : ${id}`
                })
            }
        } catch (error) {
            res.status(500).json({
                message: `unable to get tweet: ${error}`
            })
        }
    },  

}

