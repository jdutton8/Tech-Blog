const router = require('express').Router();
const { User, Posts } = require('../../models');
const withAuth = require('../../utils/auth')

//get users
router.get("/", async (req, res) => {
  try {
    const userData = await User.findAll();
    res.status(200).json(userData);
    console.log("users request");
  } catch (err) {
    res.status(500).json(err);
    console.log("user request failed");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id, {});

    if (!userData) {
      res.status(404).json({ message: "No user found with that id!" });
      return;
    }

    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//* User login
router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { user_name: req.body.user_name },
    });

    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect username , please try again" });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect  password, please try again" });
      return;
    }
    try {
      const posts = await Posts.findAll({
        where: { userId: userData.id },
      });

      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.logged_in = true;

        res.json({
          user: userData,
          message: "You are now logged in!",
          posts: posts.map((post) => post.toJSON()),
        });
      });
    } catch (err) {
      res.status(400).json(err);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

//* User logout
router.post("/logout", withAuth, async (req, res) => {
  try {
    if (req.session.logged_in) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

//* Signup route
router.post("/signup", async (req, res) => {
  try {
    //* Create a new user in the database
    const userData = await User.create(req.body);

    //* Set the user's session and send a response
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      res.status(200).json({ message: "Signup successful" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Signup failed" });
  }
});

// Delete route
router.delete("/:id", (req, res) => {
  // Looks for the books based on isbn given in the request parameters and deletes the instance from the database
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((deletedUser) => {
      res.json(deletedUser);
    })
    .catch((err) => res.json(err));
});


module.exports = router;
