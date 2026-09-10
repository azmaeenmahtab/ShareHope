const express = require("express");
const router = express.Router();

router.get('/donation-request/create', (req, res) => {
    res.json({ message: "Donation request create route" });
});

module.exports = router;
