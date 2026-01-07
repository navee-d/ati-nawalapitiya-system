# Development Guide - ATI Nawalapitiya Campus Management System

## 🏗️ Architecture Overview

### Technology Stack

**Backend:**
- Node.js & Express.js - Server framework
- MongoDB & Mongoose - Database
- JWT - Authentication
- bcryptjs - Password hashing
- express-validator - Input validation

**Frontend:**
- React 18 - UI framework
- React Router v6 - Client-side routing
- Axios - HTTP client
- CSS3 - Styling

### Project Structure

```
ati-nawalapitiya-system/
├── backend/
│   ├── controllers/     # Business logic
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & validation
│   ├── scripts/         # Utility scripts
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static files
│   └── src/
│       ├── pages/       # React components
│       ├── services/    # API calls
│       ├── App.js       # Main component
│       └── index.js     # Entry point
└── package.json         # Dependencies
```

## 🔧 Development Workflow

### 1. Setting Up Development Environment

```bash
# Clone repository
git clone <repository-url>
cd ati-nawalapitiya-system

# Install dependencies
npm install
cd frontend && npm install && cd ..

# Set up environment
cp .env.example .env
# Edit .env with your settings

# Seed database
node backend/scripts/seed.js

# Start development servers
npm run dev-all
```

### 2. Creating a New Module

#### Step 1: Create Model
```javascript
// backend/models/NewModule.model.js
const mongoose = require('mongoose');

const newModuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // ... other fields
}, {
  timestamps: true,
});

module.exports = mongoose.model('NewModule', newModuleSchema);
```

#### Step 2: Create Controller
```javascript
// backend/controllers/newmodule.controller.js
const NewModule = require('../models/NewModule.model');

exports.getAll = async (req, res) => {
  try {
    const items = await NewModule.find();
    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add create, update, delete functions
```

#### Step 3: Create Routes
```javascript
// backend/routes/newmodule.routes.js
const express = require('express');
const router = express.Router();
const { getAll } = require('../controllers/newmodule.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/', getAll);

module.exports = router;
```

#### Step 4: Register Route in Server
```javascript
// backend/server.js
app.use('/api/newmodule', require('./routes/newmodule.routes'));
```

#### Step 5: Create Frontend Page
```javascript
// frontend/src/pages/NewModule.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';

function NewModule() {
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    fetchItems();
  }, []);
  
  const fetchItems = async () => {
    const response = await api.get('/newmodule');
    setItems(response.data.data);
  };
  
  return (
    <div className="card">
      <h2>New Module</h2>
      {/* Your UI here */}
    </div>
  );
}

export default NewModule;
```

#### Step 6: Add Route to Frontend
```javascript
// frontend/src/App.js
import NewModule from './pages/NewModule';

// In Routes:
<Route path="/newmodule" element={<NewModule />} />
```

## 🎨 Coding Standards

### JavaScript Style Guide

```javascript
// Use const/let, not var
const apiUrl = 'http://localhost:5000';
let counter = 0;

// Use arrow functions
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// Use async/await for promises
const fetchData = async () => {
  try {
    const response = await api.get('/data');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// Use template literals
const message = `Hello, ${user.name}!`;

// Use destructuring
const { firstName, lastName } = user;
const [first, second, ...rest] = array;
```

### MongoDB/Mongoose Best Practices

```javascript
// Always use try-catch
exports.getData = async (req, res) => {
  try {
    const data = await Model.find();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Use populate for relationships
const student = await Student.findById(id)
  .populate('course')
  .populate('department');

// Use select to limit fields
const users = await User.find().select('-password');

// Use lean() for read-only queries
const data = await Model.find().lean();
```

### React Best Practices

```javascript
// Use functional components with hooks
function MyComponent() {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  return <div>Component</div>;
}

// Handle errors in async operations
const fetchData = async () => {
  try {
    setLoading(true);
    const response = await api.get('/endpoint');
    setData(response.data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

// Use conditional rendering
{loading ? <Loading /> : <Content />}
{error && <Error message={error} />}
```

## 🔐 Security Best Practices

### 1. Input Validation
```javascript
const { body, validationResult } = require('express-validator');

router.post('/students', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('nic').matches(/^[0-9]{9}[vVxX]$/),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process request
});
```

### 2. Password Handling
```javascript
// Always hash passwords
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Never send passwords in responses
const user = await User.findById(id).select('-password');
```

### 3. JWT Token Management
```javascript
// Set appropriate expiration
const token = jwt.sign({ id: user._id }, secret, { expiresIn: '30d' });

// Verify tokens
const decoded = jwt.verify(token, secret);
```

### 4. CORS Configuration
```javascript
// Configure CORS properly
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));
```

## 🧪 Testing

### Manual Testing
```bash
# Test API endpoints
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ati.lk","password":"admin123"}'
```

### Integration Testing (Future)
```javascript
// Example with Jest and Supertest
const request = require('supertest');
const app = require('../server');

describe('POST /api/auth/login', () => {
  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@ati.lk',
        password: 'admin123'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
```

## 📊 Database Design

### Schema Design Principles

1. **Use References for Relationships**
```javascript
// Reference other collections
course: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Course'
}
```

2. **Use Virtuals for Computed Fields**
```javascript
studentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});
```

3. **Add Indexes for Performance**
```javascript
studentSchema.index({ studentId: 1 });
studentSchema.index({ department: 1, yearOfStudy: 1 });
```

4. **Use Middleware for Hooks**
```javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  // Hash password
  next();
});
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=very_secure_random_string_here
JWT_EXPIRE=7d
```

### Build Frontend for Production
```bash
cd frontend
npm run build
```

### Serve Frontend from Backend
```javascript
// In server.js
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}
```

## 🐛 Debugging

### Backend Debugging
```javascript
// Use debug logging
console.log('Debug:', variable);

// Use debugger
debugger;

// Check request data
console.log('Body:', req.body);
console.log('User:', req.user);
console.log('Params:', req.params);
```

### Frontend Debugging
```javascript
// React DevTools
// Use browser console
console.log('State:', state);
console.log('Props:', props);

// Network tab for API calls
```

## 📝 Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to repository
git push origin feature/new-feature

# Create pull request
# Merge after review
```

## 🔄 Version Control Best Practices

- Write clear commit messages
- Keep commits small and focused
- Never commit sensitive data (.env)
- Use .gitignore properly
- Create branches for features
- Review code before merging

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Introduction](https://jwt.io/introduction)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests if applicable
5. Update documentation
6. Submit a pull request

## 📞 Support

For development questions or issues:
- Create an issue in the repository
- Contact the development team
- Check existing documentation

---

**Happy Coding! 🎓**
