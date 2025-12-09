const bcrypt = require('bcryptjs');
const { User } = require('./models');

const createTestAccounts = async () => {
  try {
    const testAccounts = [
      {
        name: 'Test User 1',
        email: 'test1@northeastern.edu',
        password: 'Test123!'
      },
      {
        name: 'Test User 2', 
        email: 'test2@northeastern.edu',
        password: 'Test123!'
      },
      {
        name: 'Professor Demo',
        email: 'professor@northeastern.edu',
        password: 'Demo123!'
      },
      {
        name: 'TA Demo',
        email: 'ta@northeastern.edu',
        password: 'Demo123!'
      }
    ];

    for (const account of testAccounts) {
      // Check if account already exists
      const existing = await User.findOne({ where: { email: account.email } });
      
      if (existing) {
        console.log(`Account ${account.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(account.password, 10);
      
      // Create user
      await User.create({
        name: account.name,
        email: account.email,
        passwordHash: hashedPassword
      });

      console.log(`✅ Created account: ${account.email} / ${account.password}`);
    }

    console.log('\n📋 Test Accounts Summary:');
    console.log('========================');
    testAccounts.forEach(acc => {
      console.log(`Email: ${acc.email}`);
      console.log(`Password: ${acc.password}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error creating test accounts:', error);
  }
};

// Run if called directly
if (require.main === module) {
  createTestAccounts().then(() => {
    console.log('Done!');
    process.exit(0);
  });
}

module.exports = { createTestAccounts };