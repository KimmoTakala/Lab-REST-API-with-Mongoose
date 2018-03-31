const express = require('express') 
const logger = require('morgan')
const errorhandler = require('errorhandler')
const mongoose= require('mongoose')
const bodyParser = require('body-parser')

const url = 'mongodb://localhost:27017/edx-course-db'
let app = express()
app.use(logger('dev'))
app.use(bodyParser.json())

var accountSchema = new mongoose.Schema({ name: 'String', balance: 'Number' });
var Account = mongoose.model('Account', accountSchema);

mongoose.connect(url, function(error) {
    if (error) {
        console.log('Failed to open database connection: ' + error)
        return process.exit(1)
    }
    console.log('Waiting for HTTP requests')
  
    app.get('/accounts', (req, res, next) => {
        Account.find({}, (err, accounts) => {
            if (err)
            {
                return next(error)
            }
            res.send(accounts)
        });        
    })

  app.post('/accounts', (req, res, next) => {
    let newAccount = new Account(req.body)
    newAccount.save((err) => {
        if (err) {
            return next(err)
        }
        res.status(201).send(newAccount)
       })      
    })

  app.put('/accounts/:id', (req, res, next) => {
      Account.findById(req.params.id, (err, account) => {
        if (err || !account) {
            res.sendStatus(404);
            return next(err)
        }
        account.name = req.body.name
        account.balance = req.body.balance
        account.save((err) => {
            if (err) {
                return next(err)
            }
            res.sendStatus(200);
        })
      })
    })
   
   app.delete('/accounts/:id', (req, res) => {
    Account.findById(req.params.id, (err, account) => {
        if (err || !account) {
            res.sendStatus(404);
            return next(err)
        }
        account.remove((err) => {
            if (err) {
                return next(err)
            }
            res.sendStatus(200);
          })
        })
    })
})

app.use(errorhandler())
app.listen(3000)
 