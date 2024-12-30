// You can have multiple controllers for each route if you want more modularity

const Note = require('../models/Notes');
const mongoose = require('mongoose');

/**
 * GET/
 * Home page
 */

exports.homepage = async (req,res) => {
    const variables = {
        title : 'Home',
    }
    
    res.render('index', variables);
}

/**
 * GET/
 * About page
 */

exports.about = async (req,res) => {
    const variables = {
        title : 'About',
    }
    
    res.render('about', variables);
}

/**
 * GET/
 * Dashboard page
 */

exports.dashboard = async (req,res) => {

    try {
        const notes = await Note.find({user: req.user.id}).sort({updatedAt: -1});

        const formattedNotes = notes.map(note =>{
            return{
                ...note.toObject(),
                updatedAt: new Date(note.updatedAt).toLocaleDateString('en-GB', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})
            }
        })

        const variables = {
            title : 'Dashboard',
            layout : '../views/layouts/dashboard',
            notes: formattedNotes,
            username: req.user.firstName
        }
        
        res.render('dashboardContent', variables);

    } catch (error) {
        console.log(error);
    }
}

/**
 * GET/
 * auth page
 */

exports.authentication = async (req,res) => {
    const variables = {
        title : 'Authentication',
        layout : '../views/layouts/dashboard'
    }
    
    res.render('dashboardContent', variables);
}

/**
 * GET/
 * View note
 */

exports.dashboardViewNote = async (req,res) => {
    const note = await Note.findById({ _id: req.params.id }).where({ user: req.user.id }).lean();

    if(note){
        const variables = {
            title : note.title,
            noteTitle: note.title,
            noteBody: note.body,
            noteId: note._id,
            layout: '../views/layouts/noteView'
        }
        
        res.render('viewNotes', variables);
    }else{
        res.render('404', { layout: '../views/layouts/main'});
    }
    
}

/**
 * PUT/
 * Update note
 */

exports.dashboardUpdateNote = async (req,res) => {
    try {
        await Note.findOneAndUpdate(
            { _id: req.params.id },
            { title: req.body.title, body: req.body.body }
        ).where( {user: req.user.id} );

        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
}

/**
 * DELETE/
 * Delete note
 */

exports.dashboardDeleteNote = async (req,res) => {

    try {
        await Note.deleteOne({ _id: req.params.id }).where({ user: req.user.id });
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
}

/**
 * GET/
 * Add note page
 */

exports.dashboardAddNote = async (req,res) => {
    res.render('add', { layout: '../views/layouts/noteView', title: 'Add Note'})
}

/**
 * POST/
 * Add note to database
 */

exports.dashboardAddNoteSubmit = async (req,res) => {
    try {
        if(req.body.title && !req.body.body){
            req.body.body = "Description";
        }else if(!req.body.title && req.body.body){
            req.body.title = "Title";
        }else if(!req.body.title && !req.body.body){
            req.body.title = "Title";
            req.body.body = "Description";
        }
        
        req.body.user = req.user.id;
        await Note.create(req.body);
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error)
    }
}

/**
 * GET/
 * Display note searching dashboard
 */

exports.dashboardSearch = async (req,res) => {
    try {
        res.render('dashboardSearch', { layout: '../views/layouts/dashboard', searchResults: '', title: 'Search'})
    } catch (error) {
        console.log(error);
    }
}

/**
 * POST/
 * Search note from database
 */

exports.dashboardSearchSubmit = async (req,res) => {
    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const searchResults = await Note.find({
            $or: [
                { title: { $regex : new RegExp( searchNoSpecialChars, 'i')}},
                { body: { $regex : new RegExp( searchNoSpecialChars, 'i')}},
            ]
        }).where( {user: req.user.id });


        res.render('dashboardSearch', {
            searchResults,
            layout: '../views/layouts/dashboard',
            title: 'Search result'
        })
        
    } catch (error) {
        console.log(error);
    }
}