let http = require('http')
  , https = require('https')
  , express = require('express')
  , app = express()
  , bodyParser = require('body-parser');

let graphqlHttp = require('express-graphql')
let { buildSchema } = require('graphql')

let events = []; // temprorary storage on mem

app.use(bodyParser.json())


app.use('/graphql', graphqlHttp({
    schema: buildSchema(`

        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return events
        },
        createEvent: (args) => {
            let event = {
                _id: Math.floor(Math.random() * 1000000000).toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,  // + sign converts value to float
                date: new Date().toISOString()
            }
            events.push(event)
            return event
        }
    },
    graphiql: true // visual debuger tool
}))


// app.get('/', (req, res, next) => {
//     res.status(200).send('Welcome, API v.1.0.0')
// })


//app.listen(3000)

http.createServer(app).listen(3000);
//https.createServer({ }, app).listen(443)

