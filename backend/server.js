const Deck = require('./models/Deck');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./models/User');
const PORT = process.env.PORT || 5000;

dotenv.config({ path: './backend/.env' });
const mongoDBUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/magicapp';
app.use(cors({
  origin: 'https://magicbros.app/',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect(mongoDBUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

mongoose.connection.once('open', () => {
  console.log('MongoDB connection established successfully');
});

app.get('/', (req, res) => {
  res.send('Hello Nerds!');
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Set up session
const sessionConfig = {
  secret: 'yourSecretKey', // Replace this with a strong secret key
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb+srv://krisyarno:mongopassword@cluster0.i8vlf6d.mongodb.net/?retryWrites=true&w=majority' }),
  cookie: {
  maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
  };
  
  app.use(session(sessionConfig));
  
  // Set up Passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  
  // Routes
  app.post('/register', async (req, res) => {
      console.log('Register route called');
      const { username, password } = req.body;
      try {
        const newUser = await User.register(new User({ username }), password);
        passport.authenticate('local')(req, res, () => {
          res.status(201).json({ message: 'User created successfully', newUser });
        });
      } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: error.message });
      }
    });
    
  
  app.post('/login', passport.authenticate('local'), (req, res) => {
    res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ message: 'Logged in successfully', user: req.user });
    });    
  
  app.get('/logout', (req, res) => {
  req.logout();
  res.status(200).json({ message: 'Logged out successfully' });
  });
  
  app.use((req, res, next) => {
  if (!req.isAuthenticated()) {
  return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
  });

// Get user's decks
app.get('/decks', async (req, res) => {
  try {
    const userId = req.query.userId;
    const decks = await Deck.find({ user: userId }).exec();
    res.json(decks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
    
// Create a new deck
    app.post('/decks', async (req, res) => {
      const { name, commander, deckList } = req.body;
      const newDeck = new Deck({ name, commander, deckList, user: req.user._id });
    
      try {
        const savedDeck = await newDeck.save();
        res.status(201).json(savedDeck);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    });    
    
    
    // Update a deck by ID
    app.put('/decks/:id', async (req, res) => {
      const { name, commander, deckList } = req.body;
    
      try {
        const deck = await Deck.findById(req.params.id);
        if (!deck) {
          return res.status(404).json({ message: 'Deck not found' });
        }
    
        if (deck.user.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Unauthorized to modify this deck' });
        }
    
        const updatedDeck = await Deck.findByIdAndUpdate(
          req.params.id,
          { name, commander, deckList },
          { new: true }
        );
        res.json(updatedDeck);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    });
    
    
    // Delete a deck by ID
app.delete('/decks/:id', async (req, res) => {
    try {
      const deletedDeck = await Deck.findByIdAndDelete(req.params.id);
      if (!deletedDeck) {
        return res.status(404).json({ message: 'Deck not found' });
      }
      res.json({ message: 'Deck deleted', deletedDeck });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
