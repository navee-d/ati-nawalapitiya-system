# MongoDB Setup Guide for Windows

## Option 1: Install MongoDB Community Edition (Recommended)

### Step 1: Download MongoDB
1. Go to https://www.mongodb.com/try/download/community
2. Select:
   - Version: Latest (7.x or 6.x)
   - Platform: Windows
   - Package: MSI
3. Click Download

### Step 2: Install MongoDB
1. Run the downloaded .msi file
2. Choose "Complete" installation
3. Install MongoDB as a Windows Service (check the box)
4. Install MongoDB Compass (optional GUI tool)

### Step 3: Verify Installation
Open PowerShell and run:
```powershell
mongod --version
```

### Step 4: Start MongoDB Service
```powershell
net start MongoDB
```

## Option 2: Use MongoDB Atlas (Cloud Database - Free Tier)

### Step 1: Create Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account

### Step 2: Create a Free Cluster
1. Choose "Build a Database"
2. Select "FREE" tier (M0)
3. Choose a cloud provider and region close to you
4. Click "Create"

### Step 3: Setup Database Access
1. Click "Database Access" in left menu
2. Add a new database user
3. Choose "Password" authentication
4. Save username and password

### Step 4: Setup Network Access
1. Click "Network Access" in left menu
2. Add IP Address
3. Choose "Allow Access from Anywhere" (for development)
4. Confirm

### Step 5: Get Connection String
1. Click "Database" in left menu
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. It will look like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`

### Step 6: Update .env File
Create or update the `.env` file in the root directory:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/ati-nawalapitiya?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here
PORT=5000
NODE_ENV=development
```

Replace:
- `your-username` with your MongoDB username
- `your-password` with your MongoDB password
- `cluster0.xxxxx.mongodb.net` with your actual cluster address

## Option 3: Use Docker (If Docker is installed)

```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## After MongoDB is Running

### 1. Seed the Database
```bash
node backend/scripts/seed.js
```

### 2. Start the Application
```bash
npm run dev-all
```

### 3. Run CRUD Tests
```bash
node test_all_cruds.js
```

## Troubleshooting

### Error: "connect ECONNREFUSED"
- MongoDB is not running
- For local installation: `net start MongoDB`
- For Docker: `docker start mongodb`

### Error: "Authentication failed"
- Check username and password in connection string
- Make sure you're using the database user credentials (not MongoDB Atlas login)

### Error: "Network timeout"
- Check your internet connection (for Atlas)
- Verify IP address is whitelisted in Network Access

## Verifying MongoDB is Running

### Local Installation:
```powershell
# Check if service is running
Get-Service MongoDB

# Or try connecting with mongo shell
mongosh
```

### Docker:
```powershell
docker ps | findstr mongodb
```

### MongoDB Atlas:
- Connection string should work if setup correctly
- Check cluster status in MongoDB Atlas dashboard
