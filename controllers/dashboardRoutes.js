const router = require('express').Router();
const {Post} = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
   try { const getPosts = await Post.findAll({
        where: {
            userId: req.session.userId
        }
    });
    const posts = getPosts.map(post => post.get({plain: true}));
    res.render('all-posts-admi', {
        layout: 'dashboard',
         posts,
    });
} catch(err) {
    res.redirect('login');
}
});

router.get('/edit/:id', withAuth, async (req, res) => {
   try {
    const editPost = await Post.findByPK(req.params.id);
    
    if(!editPost) {
        res.status(404).json({message: 'No post was found with this id.'});
        return;
    };
    const post = editPost.get({plain: true});

    res.render('edit-post', {
       layout: 'dashboard',
        post
    });
} catch(err) {
    res.redirect('login');
};
});

router.get('/new', withAuth, (req, res) => {
        res.render('new-post', {
            layout: 'dashboard',
            });
});

module.exports = router;