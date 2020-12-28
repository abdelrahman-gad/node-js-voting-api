
module.exports={
    MONGOURI:`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.8lvjm.mongodb.net/${process.env.MONGO_DB_DATABASE}`,
    CLIENT_URL:process.env.CLIENT_URL
}
