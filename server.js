const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    hello: String,
    name: String
  }
`);

var root = {
  hello: () => {
    return 'Hello GraphQL!';
  },
  name: () => {
    return 'Leon';
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
