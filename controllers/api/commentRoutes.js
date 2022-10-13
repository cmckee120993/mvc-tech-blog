const router = require('express').Router();
const {Comment} = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
    try {
        const getComments = await Comment.findAll({});
    res.json(getComments);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/', withAuth, async (req, res) => {
    if (req.session) {
        try {
            const newPost = await Comment.create({
                comment_text: req.body.comment_text,
                post_id: req.body.post_id,
                user_id: req.session.user_id,
            });
            res.json(newPost);
        } catch (err) {
            res.status(400).json(err);
        };
    };
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const destroyComment = await Comment.destroy({
            where: {
                id: req.params.id
            }
        });
        if (!destoryComment) {
            res.status(404).json({message: 'No comment found with this id.'});
            return;
        }
        res.json(destoryComment);
    } catch (err) {
        res.status(500).json(err)
    };
});

module.exports = router;