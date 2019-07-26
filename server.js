const { ApolloServer } = require('apollo-server');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
    })
    .then(() => console.log('---DB connected'))
    .catch((error) => console.log('---error', error));

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ reg }) => {
        let authToken = null;

        try {
            authToken = headers.authorization
        } catch (e) {
            new Error(e);
        }
    }
});

server.listen().then(({ url }) => {console.log('---Server listening on', url);});
