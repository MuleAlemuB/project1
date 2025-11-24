const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/yourDBName')
  .then(() => {
    console.log('MongoDB connected');
    return createTestUser();
  })
  .catch(err => console.error(err));

async function createTestUser() {
  const testUser = new User({
    name: 'John Doe',
    email: 'john@example.com',
    password: '123456',
    role: 'Employee',
  });

  await testUser.save();
  console.log('Test user created');
  mongoose.disconnect();
}
