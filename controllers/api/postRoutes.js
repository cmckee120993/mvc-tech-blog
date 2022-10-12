const router = require('express').Router();
const {Post, User, Comment} = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
    try {
        const getPosts = await Post.findAll({
        attributes: [
            'id',
            'title',
            'created_at',
            'post_content'
        ],
        order: [[
            'created_at',
            'DESC'
        ]],
        include: [
            {
                model: Comment, 
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: [username]
            },
        ]
    });  
    res.json(getPosts); 
} catch(err) {
    res.status(500).json(err);
}
});

router.get('/:id', async (req, res) => {
    try{
        const getPost = await Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'title',
                'created_at',
                'post_content'
            ],
            include: [
                {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
            ]
        });
        if(!getPost) {
            res.status(404).json({message: 'No post found with this id.'});
            return;
        };
        res.json(getPost);
    } catch(err) {
        res.status(500).json(err);
    };
});

router.post('/', withAuth, async (req, res) => {
   try {
   const createPost = await Post.create({
        title: req.body.title,
        post_content: req.body.post_content,
        user_id: req.session.user_id
    });
    res.json(createPost);
   } catch(err) {
    res.status(500).json(err);
   };
});

router.put('/:id', withAuth, async (req, res) => {
    try {
    const updatePost = await Post.update({
        title: req.body.title,
        post_content: req.body.post_content
    },
    {
        where: {
            id: req.params.id
        }
    });
    if(!updatePost) {
        res.status(404).json({message: 'No post found with this id.'})
    };
    res.json(updatePost);
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
    };
    res.json(deletePost);
} catch(err) {
    res.status(500).json(err);
};
});

module.exports = router;