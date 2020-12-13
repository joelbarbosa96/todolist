const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
// User Model
const User = require("../models/User");

// @route   POST /register
// @desc    Register user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName } = req.body;

    // Validation
    if (!email || !password || !passwordCheck) {
      return res
        .status(400)
        .json({ msg: "Please enter all the required fields." });
    }

    if (password.length < 5) {
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long." });
    }

    if (password !== passwordCheck) {
      return res.status(400).json({ msg: "Please enter a matching password." });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered." });
    }

    if (!displayName) {
      displayName = email;
    }

    // Password hashing
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Save User
    const newUser = new User({
      email,
      password: passwordHash,
      displayName,
    });

    const saveUser = await newUser.save();
    res.json(saveUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /login
// @desc    Login user
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate

    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "Please enter all the required fields." });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: "No account with given email." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN);

    res.json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /tokenIsValid
// @desc    Check if token  is valid
// @access  Public
router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.json(false);
    }
    const verified = jwt.verify(token, process.env.JWT_TOKEN);
    if (!verified) {
      return res.json(false);
    }

    const user = await User.findById(verified.id);
    if (!user) {
      return res.json(false);
    }

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /
// @desc    Get logged in user
// @access  Private
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    displayName: user.displayName,
    id: user._id,
  });
});

module.exports = router;
