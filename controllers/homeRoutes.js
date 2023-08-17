const router = require('express').Router();
const { Posts, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/login', (req, res) => {
  try {
    if(req.session.loggedIn) {
      res.redirect('/profile');
      return;
    }
    res.render('login');

  } catch (err) {
    res.status(500).json(err);
  }
    });




module.exports = router;
