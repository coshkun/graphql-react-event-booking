let http = require('http')
  , https = require('https')
  , express = require('express')
  , app = express()
  , bodyParser = require('body-parser');

let graphqlHttp = require('express-graphql')
let { buildSchema } = require('graphql')
let mongoose = require('mongoose')

//let events = []; // temprorary storage on mem

let Event = require('./models/event')

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
            //return events
            return Event.find()      // first return holds the grapql here to start async operation
            .then(events => {
                return events.map(event => { 
                    return {
                        _id: event._doc._id.toString(),
                        title: event._doc.title,
                        description: event._doc.description,
                        price: event._doc.price,
                        date: event._doc.date.toISOString()
                    }
                    // yada kısaca: return { ...event._doc, _id: event._doc._id.toString()  }
                    // yada kısaca: return { ...event._doc, _id: event.id  }   // event.id gives same string
                })
            })
            .catch(err => {throw err})
        },
        createEvent: (args) => {
            // let event = {
            //     _id: Math.floor(Math.random() * 1000000000).toString(),
            //     title: args.eventInput.title,
            //     description: args.eventInput.description,
            //     price: +args.eventInput.price,  // + sign converts value to float
            //     date: new Date().toISOString()
            // }
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,  // + sign converts value to float
                date: new Date(args.eventInput.date)
            })

            return event.save()  //you must return entire object to graphql understands that we are starting an async operation
            .then(result => {
                console.log(result)
                return {...result._doc, _id: event._doc._id.toString()}
            })
            .catch(err => {
                console.log(err)
                throw err
            })

            //events.push(event)
            //return event
        }
    },
    graphiql: true // visual debuger tool
}))


// app.get('/', (req, res, next) => {
//     res.status(200).send('Welcome, API v.1.0.0')
// })

let uri = `mongodb+srv://${process.env.MONGO_ATLAS_USR}:${process.env.MONGO_ATLAS_PWD}@cluster0-88i0f.mongodb.net/${process.env.MONGO_ATLAS_DB}?retryWrites=true&w=majority`
let options = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connect(uri, options)
.then(() => {
    console.log('**Mongoose Connected!')
    http.createServer(app).listen(process.env.PORT || 3000);
}).catch(err => { console.log(err) })

//app.listen(3000)

//http.createServer(app).listen(3000);
//https.createServer({ }, app).listen(443)

