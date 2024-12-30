const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/checkAuth');
const mainController = require('../controllers/noteControllers');

router.get("/", mainController.homepage);
router.get("/about", mainController.about);
router.get("/dashboard", isLoggedIn, mainController.dashboard);

router.get("/dashboard/note/:id", isLoggedIn, mainController.dashboardViewNote);
router.put("/dashboard/note/:id", isLoggedIn, mainController.dashboardUpdateNote);
router.delete("/dashboard/note-delete/:id", isLoggedIn, mainController.dashboardDeleteNote);
router.get("/dashboard/add", isLoggedIn, mainController.dashboardAddNote);
router.post("/dashboard/add", isLoggedIn, mainController.dashboardAddNoteSubmit);
router.get("/dashboard/search", isLoggedIn, mainController.dashboardSearch);
router.post("/dashboard/search", isLoggedIn, mainController.dashboardSearchSubmit);

module.exports = router;