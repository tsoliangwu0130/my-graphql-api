const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');


var schema = buildSchema(`
  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }

  type Query {
    getMessage(id: ID!): Message
    ip: String
  }
`);

class Message {
  constructor(id, { content, author }) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}

function logginMiddleware(req, res, next) {
  console.log(`ip: ${req.ip}`);
  next();
}

var fakeDatabase = {};
var root = {
  ip: function(args, request) {
    return request.ip;
  },
  getMessage: function ({ id }) {
    if (!fakeDatabase[id]) {
      throw new Error(`no message found with id ${id}`);
    } else {
      return new Message(id, fakeDatabase[id]);
    }
  },
  createMessage: function({ input }) {
    var id = require('crypto').randomBytes(10).toString('hex');
    fakeDatabase[id] = input;
    return new Message(id, input);
  },
  updateMessage: function({ id, input }) {
    if (!fakeDatabase[id]) {
      throw new Error(`no message found with id ${id}`);
    } else {
      fakeDatabase[id] = input;
      return new Message(id, input);
    }
  }
};

var app = express();
app.use(logginMiddleware);
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
