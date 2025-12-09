const { User } = require('./models');

const createTestAccounts = async () => {
  try {
    const testAccounts = [
      { name: 'Test User 1', email: 'test1@northeastern.edu', password: 'Test123!' },
      { name: 'Test User 2', email: 'test2@northeastern.edu', password: 'Test123!' },
      { name: 'Professor Demo', email: 'professor@northeastern.edu', password: 'Demo123!' },
      { name: 'TA Demo', email: 'ta@northeastern.edu', password: 'Demo123!' }
    ];

    for (const account of testAccounts) {
      const existing = await User.findOne({ where: { email: account.email } });
      
      if (existing) {
        console.log(`Account ${account.email} already exists, skipping...`);
        continue;
      }

      // 直接传入明文密码，让 beforeCreate hook 处理 hash
      await User.create({
        name: account.name,
        email: account.email,
        passwordHash: account.password  // 传入明文！
      });

      console.log(`✅ Created account: ${account.email} / ${account.password}`);
    }

    console.log('\n📋 Test Accounts Created!');
    
  } catch (error) {
    console.error('Error:', error);
  }
};

if (require.main === module) {
  createTestAccounts().then(() => {
    console.log('Done!');
    process.exit(0);
  });
}

module.exports = { createTestAccounts };