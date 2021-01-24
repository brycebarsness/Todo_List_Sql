const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

//get info from db and sent back to client
router.get('/', (req, res) => {
    let queryText = (`SELECT * FROM "tasks" ORDER BY "id" ASC;`)
    pool.query(queryText)
    .then(result => {
        console.log(result);
            res.send(result.rows);
        }
    ).catch((error) => {
            console.log('error with get route', error);
            res.sendStatus(500);
        });
    
});









module.exports = router;