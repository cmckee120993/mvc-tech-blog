const router = require('express').Router();
const {User, Post, Comment} = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
    try {
        const getUsers = await User.findAll({
        attributes: {exclude: ['password']}
    });
    res.json(getUsers);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try { 
        const getUser = await User.findOne({
        attributes: {exclude: ['password']},
        where: {
            id: req.params.id
        },
        include: [{
            model: Post,
            attribute: ['id', 'title', 'post_content', 'created_at']
        },
    {
        model: Comment,
        attributes: ['id', 'comment_text', 'created_at'],
        include: {
            model: Post,
            attributes: ['title']
        }
    }]
    });
    if (!getUser) {
        res.status(404).json({message: 'No user found with this id.'});
        return;
    } 
    res.json(getUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/', async (req, res) => {
    try {
        const newUser = await User.create ({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    req.session.save(() => {
        req.session.user_id = newUser.id;
        req.session.username = newUser.username;
        req.session.email = newUser.email;
        req.session.loggedIn = true;
        res.json(newUser);
    })
} catch (err) {
    res.status(500).json(err)
};
});

router.post('/login', async (req, res) => {
    try{
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if(!user) {
            res.status(400).json({message: 'No user with that email address.'});
            return;
        };
        const password = await user.checkPassword(req.body.password);

        if(!password) {
            res.status(400).json({ message: 'Problem with login information'});
            return;
        }
        req.session.save(() => {
            req.session.user_id = user.id;
            req.session.username = user.username;
            req.session.loggIn = true;
        })
        res.json({ user: user, message: 'You are now logged in.'});
    } catch (err) {
        res.status(500).json(err);
    };
});

router.post('/logout', (req, res) => {
    if(req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

router.put('/:id', withAuth, async (req, res) => {
try {
    const updateUser = await User.update(req.body, {
    where: {
        id: req.params.id
    }
});
if(!updateUser) {
    res.status(404).json({message: 'No user found with this id.'});
    return;
} res.json(updateUser);
} catch(err) {
    res.status(500).json(err);
};
});

router.delete('/:id', withAuth, async (req, res) => {
    try { 
        const deleteUser = await User.destroy({
        where: {
            id: req.params.id
        }
    });
    if(!deleteUser) {
        res.status(404).json({message: 'No user found with this id.'});
    }
    res.json(deleteUser);
} catch(err) {
    res.status(500).json(err);
};
});

module.exports = router;