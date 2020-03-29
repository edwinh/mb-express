const express = require('express')
const router = express.Router()
const Subscriber = require('../models/subscriber')

module.exports = router

// Middleware getSubscriber
const getSubscriber = async (req, res, next) => {
  let subscriber 
  try {
    subscriber = await Subscriber.findById(req.params.id)
    if (subscriber == null) {
      return res.status(404).json({message: `Subscriber with id: ${req.params.id} not found`})
    }
  } catch (err) {
    return res.status(500).json({message: err.message})
  }
  res.subscriber = subscriber
  next()
}

// Getting all
router.get('/', async (req, res) => {
  try {
    const subscribers = await Subscriber.find()
    res.json(subscribers)
  }
  catch (err) {
    res.status(500).json({message: err.message})
  }
})
// Getting one
router.get('/:id', getSubscriber, async (req, res) => {
  res.json(res.subscriber)
})

// Create one
router.post('/', async (req, res) => {
  const subscriber = new Subscriber({
    name: req.body.name,
    subscribedToChannel: req.body.subscribedToChannel
  })
  try {
    const newSubscriber = await subscriber.save()
    res.status(201).json(newSubscriber)
  }
  catch (err) {
    res.status(400).json({message: err.message})
  }
  
})

// Update one
router.patch('/:id', getSubscriber, async (req, res) => {
  if (req.body.name != null) {
    res.subscriber.name = req.body.name
  }
  if (req.body.subscribedToChannel != null) {
    res.subscriber.subscribedToChannel = req.body.subscribedToChannel
  }
  try {
    res.subscriber.save();
    res.status(200).json(res.subscriber)
  } catch (err) {
    res.status(500).json({message: err.message})
  }
  
})

// Delete one
router.delete('/:id', getSubscriber, async (req, res) => {
  try {
    res.subscriber.remove();
    res.json({message: 'Subscriber deleted'})
  } catch (err) {
    res.status(500).json({message: err.message})
  }
})

// Delete all
router.delete('/', (req, res) => {
  try {
    Subscriber.collection.drop()
    res.json({message: 'All subscribers deleted'})
  } catch (err) {
    res.status(500).json({message: err.message})
  }
})

