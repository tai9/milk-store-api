const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { registerValidation, loginValidation } = require("../validations/auth");

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  // check if the user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).send({ message: "Email already exist" });

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const userSaved = await user.save();
    res.status(200).json({ user: userSaved._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const userExist = await User.findOne({ email: req.body.email });
  if (!userExist)
    return res.status(401).send({ message: "Email or password is invalid" });

  const validPass = await bcrypt.compare(req.body.password, userExist.password);
  if (!validPass)
    return res.status(401).send({ message: "Email or password is invalid" });

  const expiredAt = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
  const token = jwt.sign(
    { _id: userExist._id, iat: expiredAt },
    process.env.TOKEN_SECRET
  );
  res.header("Authorization").send({
    name: userExist.name,
    access_token: token,
    expiredAt,
  });
});

module.exports = router;
