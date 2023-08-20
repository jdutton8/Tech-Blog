const router = require('express').Router();
const { User } = require('../../models');
//const withAuth = require('../../utils/auth')



//* Signup route
router.post("/signup", async (req, res) => {
  try {
    //* Create a new user in the database
    const userData = await User.create({
     where: {username: req.body.username,
      password: req.body.password},
    });

    console.log(userData);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

     res.status(200).json({ message: 'Signup success!'});
    });
  } catch (err) {
    res.status(400).json({ message: 'Signup failed'});
  }
});

//* User login
router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { username: req.body.username },
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

      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.logged_in = true;

        res.status(200).json({
          user: userData,
          message: "You are now logged in!",
          logged_in: req.session.logged_in
        });
      });
    } catch (err) {
      res.status(400).json(err);
    }
});

//* User logout
router.post("/logout", (req, res) => {
    if (req.session.logged_in) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
});




module.exports = router;
