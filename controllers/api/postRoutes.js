const router = require('express').Router();
const { Posts } = require('../../models');

router.get('/', (req, res) => {
    res.render('posts'), {
      logged_in: req.session.logged_in
    };
});

router.post('/', async (req, res) => {
  try {
    const newPost = await Posts.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
    res.render('profile'), {
      logged_in: req.session.logged_in
    };
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const postData = await Posts.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
