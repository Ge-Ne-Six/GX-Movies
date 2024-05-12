const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { handleError, adminAuth, adminToken, checkAdmin } = require('../middleware/authmiddleware');
const Movie = require('../models/movies');
const multer = require('multer');

const router = express.Router();
router.use(cookieParser());

router.get('*', checkAdmin);

const maxAge = 1 * 24 * 60 * 60;

router.get('/login', async (req, res) => {
  res.render('adminLogin');
});

router.get('/', adminAuth, async (req, res) => {
  try {
    const users = await User.find();
    res.render('admindash', { users });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error');
  }
});

// Initialize movieUpload
const movieStorage = multer.diskStorage({
  destination: './public/Movies/',
  filename: function (req, file, cb) {
    const fileName = `${file.originalname}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage: movieStorage });

router.get('/movies-upload', (req, res) => {
  res.render('movie-upload');
});

router.get('/logout', (req, res) => {
  res.clearCookie('GenesixAdmin');
  res.redirect('/admin/login');
});

router.get('/user/:id', adminAuth, (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then(result => {
      res.render('usersdetails', { user: result });
    })
    .catch(err => {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
    });
});

router.delete('/:id', adminAuth, (req, res) => {
  const id = req.params.id;
  User.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/admin' });
    })
    .catch(err => {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
    });
});

router.post('/adminStatus/:id', adminAuth, async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  try {
    await User.findByIdAndUpdate(id, { status });
    res.json({ redirect: '/admin' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await User.login({ email, password });
    if (admin && admin.status === 'ADMIN') {
      const adminT = adminToken(admin._id);
      res.cookie('GenesixAdmin', adminT, { httpOnly: true, maxAge: maxAge * 1000, secure: true });
      res.redirect('/admin');
    } else {
      res.status(401).json({ adminError: 'You are not an admin' });
    }
  } catch (err) {
    console.error(err);
    let errors = handleError(err);
    res.status(400).json({ errors });
  }
});

router.post('/movies-upload', upload.fields([{ name: 'newMovie' }, { name: 'image' }]), async (req, res) => {
  try {
    const { newMovie, image } = req.files;
    const { title, description, language, quality, year, genre, type } = req.body;

    const newMovieEntry = new Movie({
      title,
      image: image,
      description,
      language,
      quality,
      year,
      genre,
      type,
      filePath: newMovie
    });

    const checkMovie = await Movie.findOne({ title });

    if (!checkMovie) {
      await newMovieEntry.save();
      res.redirect('/admin');
    } else {
      res.status(400).json({ message: 'This movie already exists!' });
    }
  } catch (error) {
    console.error('Error saving movie and image:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
