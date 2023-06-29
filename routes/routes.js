const express = require('express');
const router = express.Router();
const Pages = require('../models/users');
const multer = require('multer');



//insert pages intto db
router.post('/post/create/new', async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            throw new Error('Title is required');
        }

        const pages = new Pages({
            title,
            description,
        });

        await pages.save();
        req.session.message = {
            type: 'success',
            message: 'Post Saved Successfully!',
        };

    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
    res.redirect('/');
});

//fetch all posts
router.get('/', async (req, res) => {
    try {
        const pages = await Pages.find().exec();
        res.render('index', {
            title: 'Home Page',
            pages: pages
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});


router.get('/post/create/new', (req, res) => {
    res.render('add_pages', { title: 'Add Pages' })
});

//edit post
// edit post
router.get('/post/create/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const pages = await Pages.findById(id).exec();

        if (pages == null) {
            res.redirect('/');
        } else {
            res.render('edit_pages', {
                title: 'Edit Pages',
                pages: pages,
            });
        }
    } catch (err) {
        res.redirect('/');
    }
});


//update post
router.post('/post/create/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Pages.findByIdAndUpdate(id, {
            title: req.body.title,
            description: req.body.description,
        });
        req.session.message = {
            type: 'success',
            message: 'Post Updated Successfully!',
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});
//delete post
router.get('/post/create/delete/:id', async (req, res) => {
    try {
        let id = req.params.id;
        await Pages.findByIdAndRemove(id);
        req.session.message = {
            type: 'info',
            message: 'Post Deleted Successfully!',
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message });
    }
});

module.exports = router;