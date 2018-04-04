const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    quoteOfTheDay: String,
    random: Float!
    rollThreeDice: [Int]
  }
`);

var root = {
  quoteOfTheDay: () => {
    var randomNum = Math.random();
    return randomNum < 0.5 ? `${randomNum} < 0.5` : `${randomNum} > 0.5`;
  },
  random: () => {
    return Math.random();
  },
  rollThreeDice: () => {
    return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6))
  }
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
