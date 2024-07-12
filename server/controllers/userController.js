  const User = require("../models/User");

  exports.getUsers = async (req, res) => {
    try {
      // .select is for hide password from json object
      const users = await User.find().select('-password');
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

