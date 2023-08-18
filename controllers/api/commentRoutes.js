const router = require('express').Router();
const { Posts, User, Comments } = require('../../models');

//render new comment view with form
router.get('/new', (req, res) => {
    res.render('new-comment'), {
        loggedIn: req.session.loggedIn
    };
}
);

// Post request to add comment to database upon form submission
router.post('/', async (req, res) => {
    try {
        const newComment = await Comments.create({
            content: req.body.content,
            user_id: req.session.user_id,
            post_id: req.body.post_id
        });

        res.status(200).json(newComment);
    } catch (err) {
        res.status(400).json(err);
    }
}
);

module.exports = router;