const router = require('express').Router();
const {Post} = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
   const body = req.body;

    try {
   const newPost = await Post.create({
       ...body,
        userId: req.session.userId
    });
    res.json(newPost);
   } catch(err) {
    res.status(500).json(err);
   };
});

router.put('/:id', withAuth, async (req, res) => {
    try {
    const [updatePost] = await Post.update(
        req.body, {
            where: {
                id: req.params.id
            }
        });
    if([updatePost > 0]) {
        res.status(200).end();
    } else {
        res.status(404).json({message: 'No post found with this id.'})
    }
} catch (err) {
    res.status(500).json(err);
}
});

router.delete('/:id', withAuth, async (req, res) => {
   try {
     const deletePost = await Post.destory({
        where: {
            id: req.params.id
        }
    })
    if(!deletePost) {
        res.status(404).json({message: 'No post found with that id.'});
        return;
    } else {
    res.json(deletePost);
}
} catch(err) {
    res.status(500).json(err);
};
});

module.exports = router;