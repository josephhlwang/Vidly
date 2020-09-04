const express = require("express");
const { Customer, validateCustomer } = require("../models/customer");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../middleware/validate");
const validateId = require("../middleware/validateId");

const router = express.Router();

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.get("/:id", validateId, async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send("Customer not found.");

  res.send(customer);
});

router.post("/", [auth, validate(validateCustomer)], async (req, res) => {
  if (await Customer.findOne({ phone: req.body.phone }))
    return res.status(403).send("Customer already exists.");

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  customer = await customer.save();
  res.send(customer);
});

router.put(
  "/:id",
  [auth, validate(validateCustomer), validateId],
  async (req, res) => {
    let customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send("Customer not found.");

    if (req.body.name) customer.name = req.body.name;
    if (req.body.phone) customer.phone = req.body.phone;
    if (req.body.isGold) customer.isGold = req.body.isGold;
    customer = await customer.save();
    res.send(customer);
  }
);

router.delete("/:id", [auth, admin, validateId], async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer) return res.status(404).send("Customer not found.");

  res.send(customer);
});

module.exports = router;
