let mongoose = require('mongoose')
let Schema = mongoose.Schema

let eventSchema = new Schema({
    //_id: Schema.Types.ObjectId,
    title: {type:String, required:true},
    description: {type:String, required:true},
    price: {type:Number, required:true},
    date: {type:Date, required:true}
})

module.exports = mongoose.model('Event', eventSchema)