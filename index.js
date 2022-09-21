const { ApolloServer, gql } = require("apollo-server");
const { ApolloServerPluginLandingPageGraphQLPlayground } = require("apollo-server-core");

const { events, users, participants, locations } = require("./data.json");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Event {
    id: ID!
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
    location_id: Int
    user_id: ID!
    user: User!
    participants: [Participant!]!
    location: Location!
  }

  type Location {
    id: ID!
    name: String!
    desc: String!
    lat: Float!
    lng: Float!
  }

  type Participant {
    id: ID!
    user_id: ID!
    event_id: ID!
  }

  type Query {
    # USER
    users: [User!]!
    user(id: ID!): User!

    # EVENT
    events: [Event!]!
    event(id: ID!): Event

    # LOCATİON
    locations: [Location!]!
    location(id: ID!): Location!

    # PARTİCİPANTS
    participants: [Participant!]!
    participant(id: ID!): Participant
  }
`;

const resolvers = {
  Query: {
    // USER
    users: () => users,
    user: (parent, args) => users.find((user) => user.id === parseInt(args.id)),

    // EVENT
    events: () => events,
    event: (parent, args) =>
      events.find((event) => event.id === parseInt(args.id)),

    //LOCATİON
    locations: () => locations,
    location: (parent, args) =>
      locations.find((location) => location.id === parseInt(args.id)),

    // PARTİCİPANT
    participants: () => participants,
    participant: (parent, args) =>
      participants.find((participant) => participant.id === parseInt(args.id)),
  },

  Event: {
    user: (parent) => users.find((user) => user.id === parent.user_id),
    participants: (parent) =>
      participants.filter(
        (participant) => participant.event_id === parseInt(parent.id)
      ),
    location: (parent) =>
      locations.find(
        (location) => location.id === parseInt(parent.location_id)
      ),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground({
      // options
    }),
  ],
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
