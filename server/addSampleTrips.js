// Add Sample Trips to Test Accounts
// Run this after creating test accounts

const { User, Trip, Activity } = require('./models');

const addSampleTrips = async () => {
  try {
    // Find test user 1
    const testUser1 = await User.findOne({ where: { email: 'test1@northeastern.edu' } });
    
    if (!testUser1) {
      console.log('Test user 1 not found. Create test accounts first.');
      return;
    }

    console.log('Adding sample trips for test1@northeastern.edu...');

    // Sample Trip 1: Tokyo
    const trip1 = await Trip.create({
      userId: testUser1.id,
      destination: 'Tokyo, Japan',
      startDate: '2025-03-15',
      endDate: '2025-03-18',
      budget: 1200,
      styles: 'cultural, foodie',
      aiResponse: JSON.stringify({
        destination: 'Tokyo, Japan',
        totalDays: 3,
        totalEstimatedCost: 1150,
        days: [
          {
            dayNumber: 1,
            title: 'Arrival and Shibuya Exploration',
            activities: [
              {
                timeSlot: '10:00 AM',
                activityName: 'Arrive at Narita Airport',
                description: 'Clear customs and take Narita Express to Tokyo',
                estimatedCost: 35,
                location: 'Narita Airport',
                category: 'transport'
              },
              {
                timeSlot: '2:00 PM',
                activityName: 'Shibuya Crossing',
                description: "Visit the world's busiest pedestrian crossing",
                estimatedCost: 0,
                location: 'Shibuya',
                category: 'attraction'
              },
              {
                timeSlot: '6:00 PM',
                activityName: 'Dinner at Ichiran Ramen',
                description: 'Try authentic Japanese ramen',
                estimatedCost: 15,
                location: 'Shibuya',
                category: 'meal'
              }
            ]
          }
        ]
      })
    });

    // Sample Trip 2: Portland  
    const trip2 = await Trip.create({
      userId: testUser1.id,
      destination: 'Portland, Oregon',
      startDate: '2025-04-10',
      endDate: '2025-04-12',
      budget: 600,
      styles: 'foodie, relaxed',
      aiResponse: JSON.stringify({
        destination: 'Portland, Oregon',
        totalDays: 2,
        totalEstimatedCost: 580,
        days: [
          {
            dayNumber: 1,
            title: 'Food Carts and Powell\'s Books',
            activities: [
              {
                timeSlot: '9:00 AM',
                activityName: 'Flight to Portland',
                description: 'Short flight from San Francisco',
                estimatedCost: 120,
                location: 'SFO to PDX',
                category: 'transport'
              },
              {
                timeSlot: '12:00 PM',
                activityName: 'Food Cart Lunch',
                description: 'Try famous Portland food carts',
                estimatedCost: 15,
                location: 'Downtown Portland',
                category: 'meal'
              }
            ]
          }
        ]
      })
    });

    console.log('✅ Created sample trip 1: Tokyo, Japan');
    console.log('✅ Created sample trip 2: Portland, Oregon');
    console.log('\nTest account test1@northeastern.edu now has 2 sample trips!');
    
  } catch (error) {
    console.error('Error adding sample trips:', error);
  }
};

// Run if called directly
if (require.main === module) {
  addSampleTrips().then(() => {
    console.log('Done!');
    process.exit(0);
  });
}

module.exports = { addSampleTrips };