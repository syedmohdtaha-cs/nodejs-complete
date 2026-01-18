const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type Query {
  cases: [Case]
}

type Case {
  id: ID!
  title: String!
  description: String!
}
`);
