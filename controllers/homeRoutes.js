const router = require('express').Router();
const { Posts, User, } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    const postData = await Posts.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const posts = postData.map((post) => post.get({plain:true}));

    res.render('home', { posts, logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json(err)
  }
  
});

router.get('/profile', withAuth, async (req, res) => {
  try {
      const userData = await User.findByPk(req.session.user_id, {
          attributes: { exclude: ['password'] },
          include: [{ model: Posts }],
      });
      const user = userData.get({ plain: true});
      res.render('profile', {
          ...user,
          logged_in: true,
      });
  } catch (err) {
      res.status(500).json(err);
  }
}
);

router.get('/login', (req, res) => {
    if(req.session.logged_In) {
      res.redirect('/profile');
      return;
    }
    res.render('login');

  });

 router.get('/signup', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/profile');
        return;
    }
  
      res.render('signup');
  }
  );


module.exports = router;
