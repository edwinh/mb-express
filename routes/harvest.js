if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const Harvest = require('../models/harvest')
const utils = require('../utils')

module.exports = router

router.get('/', async (req, res) => {
  let filter = {}
  console.log(req.query)
  
  if (req.query.from) {
    filter['spentDate'] = { $gte: utils.yyyymmddToDate(req.query.from)}
  }
  if (req.query.userName) {
    filter['userName'] = req.query.userName
  }
  if (req.query.projectName) {
    filter['projectName'] = req.query.projectName
  }
  console.log(filter)
  try {
    const timeEntries = await Harvest.find(filter)
    res.status(200).json(timeEntries)
  } catch (err) {
    res.status(500).json({message: err.message})
  }
})

router.post('/sync', getTimeentries, (req, res)=>{
  Harvest.collection.drop()
  res.timeEntries.map( async (te) => {
    const entry = new Harvest ({
      timeEntryId:      te.id,
      userId:           te.user.id,
      userName:         te.user.name,
      clientId:         te.client.id,
      clientName:       te.client.name, 
      projectId:        te.project.id,
      projectName:      te.project.name,
      taskId:           te.task.id,
      taskName:         te.task.name,
      spentDate:        te.spent_date,
      mondayOfWeekDate: utils.getMondayOfWeek(te.spent_date),
      hours:            te.hours,
      billable:         te.billable
    })
    try {
      const newEntry = await entry.save()
    }
    catch (err) {
      res.status(400).json({message: err.message})
    }
  })
  res.json(`Synced ${res.timeEntries.length} time entries`)
})

async function getTimeentries(req, res, next) {
  const from = req.body.from == null ? '' : `?from=${req.body.from}`
  let url = `${process.env.HARVEST_URL}time_entries${from}`
  console.log(url)
  let data, timeEntries = []
  try {
    do {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Harvest-Account-ID': process.env.HARVEST_ACCOUNT_ID,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.HARVEST_BEARER}`
        }
      })
      data = await response.json()
      timeEntries = [...timeEntries, ...data.time_entries]
      console.log(timeEntries.length)
      if (data.time_entries.length === 0) {
        return res.status(404).json({message: 'No time entries found'})
      }
      url = data.links.next
    }
    while (url != null)
  } catch (err) {
    return res.status(500).json({message: err.message})
  }
  res.timeEntries = timeEntries
  next()
}