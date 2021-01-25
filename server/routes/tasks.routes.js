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

//post route to get new task from client and insert to database
router.post("/", (req, res) => {
  const clientData = req.body;
  const queryText = `INSERT INTO "tasks" ("item", "complete", "due_date") VALUES ($1,$2,$3);`;
  pool
 .query(queryText, [clientData.item, clientData.complete, clientData.due_date])
    .then((result) => {
      console.log(result);
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("Error:", err);
      res.sendStatus(500);
    });
});

//put route to update the task status for a specific task
router.put("/:id", (req, res) => {
  const itemId = req.params.id;
  const completedItem = req.body;
  const queryText = `UPDATE "tasks" SET "item"=$1, "complete"=$2 WHERE "id"=$3;`;
  pool
    .query(queryText, [completedItem.item, completedItem.complete, itemId])
    .then((responseDB) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("Error:", err);
      res.sendStatus(500);
    });
});

//delete route to delete a task from database
router.delete("/:id", (req, res) => {
  const itemId = req.params.id;
  console.log(itemId);
  const queryText = `DELETE FROM "tasks" WHERE "id" = $1;`;

  pool
    .query(queryText, [itemId])
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("Error:", err);
      res.sendStatus(500);
    });
});

module.exports = router;