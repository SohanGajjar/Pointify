const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('./src/config/env');
const UserPoints = require('./src/models/UserPoints');

// Connect to MongoDB
mongoose.connect(config.database.url || 'mongodb://localhost:27017/pointify')
  .then(() => console.log('MongoDB connected for WebSocket server'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create WebSocket server directly on port 3001
const wss = new WebSocket.Server({ 
  port: 3001,
  host: '0.0.0.0', // Listen on all network interfaces
  verifyClient: (info) => {
    try {
      // Get token from query params
      const token = new URL(info.req.url, 'http://localhost').searchParams.get('token');
      if (!token) return false;
      
      // Verify JWT token
      const decoded = jwt.verify(token, config.jwt.secret);
      info.req.userId = decoded.id; // Store userId for later use
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }
});

console.log('WebSocket server starting on port 3001...');

const categoryColors = {
  dailyLogin: '#00CEC9',
  referral: '#FDCB6E',
  task: '#6C5CE7',
  achievement: '#00B894'
};

const categoryDisplayNames = {
  dailyLogin: 'Daily Login',
  referral: 'Referral',
  task: 'Task',
  achievement: 'Achievement'
};

wss.on('connection', async (ws, req) => {
  const userId = req.userId;
  console.log('Client connected with userId:', userId);

  // Initialize or get user points
  let userPoints = await UserPoints.findOne({ userId });
  if (!userPoints) {
    userPoints = await UserPoints.create({
      userId,
      totalPoints: 0,
      transactions: [],
      monthlyData: [],
      categoryData: []
    });
  }

  // Send initial points data
  ws.send(JSON.stringify({
    type: 'points_data',
    data: userPoints
  }));

  // Handle incoming messages
  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('Received message:', message);

      if (message.type === 'add_points') {
        const { category, name, amount } = message;
        
        // Create new transaction
        const transaction = {
          type: categoryDisplayNames[category],
          category,
          name,
          amount,
          timestamp: new Date()
        };

        // Update user points
        userPoints.totalPoints += amount;
        userPoints.transactions.unshift(transaction);
        if (userPoints.transactions.length > 50) {
          userPoints.transactions = userPoints.transactions.slice(0, 50);
        }

        // Update monthly data
        const currentMonth = new Date().toLocaleDateString('en-US', { month: 'short' });
        const monthIndex = userPoints.monthlyData.findIndex(m => m.month === currentMonth);
        if (monthIndex >= 0) {
          userPoints.monthlyData[monthIndex].points += amount;
        } else {
          userPoints.monthlyData.push({
            month: currentMonth,
            points: amount
          });
        }

        // Update category data
        const categoryName = categoryDisplayNames[category];
        const categoryIndex = userPoints.categoryData.findIndex(c => c.category === categoryName);
        if (categoryIndex >= 0) {
          userPoints.categoryData[categoryIndex].points += amount;
        } else {
          userPoints.categoryData.push({
            category: categoryName,
            points: amount,
            percentage: 0,
            color: categoryColors[category]
          });
        }

        // Recalculate percentages
        const totalCategoryPoints = userPoints.categoryData.reduce((sum, cat) => sum + cat.points, 0);
        userPoints.categoryData.forEach(cat => {
          cat.percentage = Math.round((cat.points / totalCategoryPoints) * 100);
        });

        // Save to database
        await userPoints.save();

        // Send updated data back
        ws.send(JSON.stringify({
          type: 'points_data',
          data: userPoints
        }));
      }
    } catch (error) {
      console.error('Error handling message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Error processing points update'
      }));
    }
  });

  // Send test points every 30 seconds (for demo purposes)
  const testInterval = setInterval(async () => {
    if (ws.readyState === WebSocket.OPEN) {
      const categories = ['dailyLogin', 'referral', 'task', 'achievement'];
      const names = {
        dailyLogin: ['Daily Check-in', 'Morning Bonus', 'Login Streak'],
        referral: ['Friend Signup', 'Referral Bonus', 'Share Reward'],
        task: ['Complete Survey', 'Watch Video', 'Rate App'],
        achievement: ['Level Up', 'First Week', 'Milestone Reached']
      };
      const amounts = {
        dailyLogin: [25, 50, 75],
        referral: [200, 300, 500],
        task: [100, 150, 200],
        achievement: [250, 500, 1000]
      };

      const category = categories[Math.floor(Math.random() * categories.length)];
      const nameOptions = names[category];
      const amountOptions = amounts[category];
      
      const testMessage = {
        type: 'add_points',
        category: category,
        name: nameOptions[Math.floor(Math.random() * nameOptions.length)],
        amount: amountOptions[Math.floor(Math.random() * amountOptions.length)],
        timestamp: new Date().toISOString()
      };

      // Process test message
      const transaction = {
        type: categoryDisplayNames[testMessage.category],
        category: testMessage.category,
        name: testMessage.name,
        amount: testMessage.amount,
        timestamp: new Date()
      };

      userPoints.totalPoints += testMessage.amount;
      userPoints.transactions.unshift(transaction);
      if (userPoints.transactions.length > 50) {
        userPoints.transactions = userPoints.transactions.slice(0, 50);
      }

      // Update monthly and category data
      const currentMonth = new Date().toLocaleDateString('en-US', { month: 'short' });
      const monthIndex = userPoints.monthlyData.findIndex(m => m.month === currentMonth);
      if (monthIndex >= 0) {
        userPoints.monthlyData[monthIndex].points += testMessage.amount;
      } else {
        userPoints.monthlyData.push({
          month: currentMonth,
          points: testMessage.amount
        });
      }

      const categoryName = categoryDisplayNames[testMessage.category];
      const categoryIndex = userPoints.categoryData.findIndex(c => c.category === categoryName);
      if (categoryIndex >= 0) {
        userPoints.categoryData[categoryIndex].points += testMessage.amount;
      } else {
        userPoints.categoryData.push({
          category: categoryName,
          points: testMessage.amount,
          percentage: 0,
          color: categoryColors[testMessage.category]
        });
      }

      // Recalculate percentages
      const totalCategoryPoints = userPoints.categoryData.reduce((sum, cat) => sum + cat.points, 0);
      userPoints.categoryData.forEach(cat => {
        cat.percentage = Math.round((cat.points / totalCategoryPoints) * 100);
      });

      // Save to database
      await userPoints.save();

      // Send updated data
      ws.send(JSON.stringify({
        type: 'points_data',
        data: userPoints
      }));

      console.log('Sent test points:', testMessage);
    }
  }, 30000); // Every 30 seconds

  // Clean up interval on disconnect
  ws.on('close', () => {
    clearInterval(testInterval);
    console.log('Client disconnected:', userId);
  });
});

// Server is already listening on port 3001
console.log('WebSocket server is running on port 3001');
console.log('Clients can connect to: ws://localhost:3001?token=YOUR_TOKEN');

// Handle server errors
wss.on('error', (error) => {
  console.error('Server error:', error);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down WebSocket server...');
  wss.close(() => {
    console.log('Server closed');
    mongoose.connection.close();
    process.exit(0);
  });
}); 