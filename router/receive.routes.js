const router = require("express").Router();

const receive_controler = require("../controler/receive.controler");

router.get("/", receive_controler.readPartition);
router.post("/", receive_controler.createReceive);

module.exports = router;
