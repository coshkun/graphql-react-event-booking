let http = require('http')
  , https = require('https')
  , express = require('express')
  , app = express()
  , bodyParser = require('body-parser');

let graphqlHttp = require('express-graphql')
let { buildSchema } = require('graphql')

app.use(bodyParser.json())


app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }

        type RootMutation {
            createEvent(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return ['Romantic Cooking', 'Sailing', 'All Night Coding']
        },
        createEvent: (args) => {
            let eventName = args.name
            return eventName
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

