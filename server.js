if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, { 
  useNewUrlParser: true,  
  useUnifiedTopology: true 
})
const db = mongoose.connection

db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to database'))

app.use(express.json())

const subscribersRouter = require('./routes/subscribers')
app.use('/subscribers', subscribersRouter)

const harvestRouter = require('./routes/harvest')
app.use('/harvest', harvestRouter)


app.listen(process.env.PORT || 80, () => console.log('Server started'))

//global.mongoose = mongoose

