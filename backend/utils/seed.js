const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const RidePost = require('../models/RidePost');
const Destination = require('../models/Destination');
const Post = require('../models/Post');
const Trip = require('../models/Trip');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travelbuddy');
    console.log(`Connected to MongoDB: ${conn.connection.host}`);

    await User.deleteMany();
    await RidePost.deleteMany();
    await Destination.deleteMany();
    await Post.deleteMany();
    await Trip.deleteMany();

    console.log('Cleared existing collections...');

    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@travelbuddy.com',
        password: 'password123',
        role: 'admin',
        gender: 'Male',
        organization: 'TravelBuddy Core',
        bio: 'Platform Operations Lead.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop',
        trustScore: 85,
        badges: ['Verified Commuter'],
        completedRides: 0,
        totalRides: 0,
        cancelledRides: 0,
        reviewsCount: 0,
        carbonSaved: 0
      },
      {
        name: 'Rahul Sharma',
        email: 'rahul@pccoer.edu.in',
        password: 'password123',
        gender: 'Male',
        organization: 'PCCOER',
        vehicle: {
          makeModel: 'Honda City',
          licensePlate: 'MH 14 AB 1234',
          type: 'Car',
          capacity: 3
        },
        bio: 'Final year CSE student at PCCOER. Daily commuter from Chinchwad to Ravet. Safety first!',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop',
        averageRating: 5.0,
        trustScore: 85,
        rewardPoints: 50,
        badges: ['Verified Commuter'],
        completedRides: 0,
        totalRides: 0,
        cancelledRides: 0,
        reviewsCount: 0,
        carbonSaved: 0
      },
      {
        name: 'Ananya Roy',
        email: 'ananya@infosys.com',
        password: 'password123',
        gender: 'Female',
        organization: 'Infosys',
        vehicle: {
          makeModel: 'Royal Enfield Meteor 350',
          licensePlate: 'MH 12 DE 5678',
          type: 'Bike',
          capacity: 1
        },
        bio: 'Software Engineer @ Infosys Hinjawadi Phase 1. Love weekend rides & daily carpooling.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop',
        averageRating: 5.0,
        trustScore: 85,
        rewardPoints: 50,
        badges: ['Verified Commuter'],
        completedRides: 0,
        totalRides: 0,
        cancelledRides: 0,
        reviewsCount: 0,
        carbonSaved: 0
      },
      {
        name: 'Vikram Patel',
        email: 'vikram@coep.ac.in',
        password: 'password123',
        gender: 'Male',
        organization: 'COEP',
        vehicle: {
          makeModel: '',
          licensePlate: '',
          type: 'None',
          capacity: 1
        },
        bio: 'Passionate backpacker & COEP tech enthusiast. Always looking for eco-friendly rides.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop',
        averageRating: 5.0,
        trustScore: 85,
        rewardPoints: 50,
        badges: ['Verified Commuter'],
        completedRides: 0,
        totalRides: 0,
        cancelledRides: 0,
        reviewsCount: 0,
        carbonSaved: 0
      }
    ]);

    console.log(`Seeded ${users.length} clean users starting with 0 rides.`);

    const rahul = users[1];
    const ananya = users[2];
    const today = new Date().toISOString().split('T')[0];

    const rides = await RidePost.create([
      {
        driver: rahul._id,
        vehicleType: 'Car',
        vehicleName: 'Honda City',
        source: 'Chinchwad',
        destination: 'Ravet',
        routeStops: [
          { stopName: 'Chinchwad', pickupPoint: 'Chinchwad Railway Station Gate 1', stopOrder: 0 },
          { stopName: 'Thergaon', pickupPoint: 'Thergaon DMart Signal', stopOrder: 1 },
          { stopName: 'Wakad', pickupPoint: 'Wakad Flyover Bridge', stopOrder: 2 },
          { stopName: 'Ravet', pickupPoint: 'PCCOER Main Gate', stopOrder: 3 }
        ],
        date: today,
        time: '08:30 AM',
        totalSeats: 3,
        availableSeats: 3,
        pricePerSeat: 90,
        community: 'PCCOER',
        rideType: 'Daily',
        status: 'active',
        description: 'Daily college commute. AC on, non-smoking, polite passengers welcome!'
      },
      {
        driver: ananya._id,
        vehicleType: 'Bike',
        vehicleName: 'Royal Enfield Meteor 350',
        source: 'Aundh',
        destination: 'Hinjawadi Phase 1',
        routeStops: [
          { stopName: 'Aundh', pickupPoint: 'Parihar Chowk', stopOrder: 0 },
          { stopName: 'Baner', pickupPoint: 'Baner Balewadi Phata', stopOrder: 1 },
          { stopName: 'Hinjawadi Phase 1', pickupPoint: 'Infosys Circle Gate 2', stopOrder: 2 }
        ],
        date: today,
        time: '09:15 AM',
        totalSeats: 1,
        availableSeats: 1,
        pricePerSeat: 50,
        community: 'Infosys',
        rideType: 'Daily',
        status: 'active',
        description: 'Morning commute to Infosys. Spare helmet available.'
      }
    ]);

    console.log(`Seeded ${rides.length} active rides.`);

    const destinations = await Destination.create([
      {
        name: 'Mahabaleshwar',
        image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=800&auto=format&fit=crop',
        description: 'Scenic hill station nestled in the Western Ghats, famous for strawberry farms, Arthur Seat, and cool weather.',
        bestTime: 'October to May',
        estimatedBudget: 3500,
        popularAttractions: ['Venna Lake', 'Elephant Head Point', 'Mapro Garden', 'Pratapgad Fort'],
        category: 'Hill Station'
      },
      {
        name: 'Goa Coastal Getaway',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop',
        description: 'Sun-kissed beaches, Portuguese heritage architecture, water sports, and vibrant beach shacks.',
        bestTime: 'November to February',
        estimatedBudget: 7500,
        popularAttractions: ['Baga Beach', 'Aguada Fort', 'Dudhsagar Waterfalls', 'Panjim Heritage Quarter'],
        category: 'Beach'
      },
      {
        name: 'Lonavala & Khandala',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop',
        description: 'Quick weekend getaway famous for lush waterfalls, monsoon mist, and chikki sweet treats.',
        bestTime: 'July to March',
        estimatedBudget: 2200,
        popularAttractions: ['Tiger Point', 'Bhushi Dam', 'Karla Caves', 'Lohagad Fort'],
        category: 'Adventure'
      },
      {
        name: 'Udaipur City of Lakes',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop',
        description: 'Royal palaces, shimmering lakes, cultural folklore, and majestic heritage architecture.',
        bestTime: 'September to March',
        estimatedBudget: 8500,
        popularAttractions: ['City Palace', 'Lake Pichola Boat Tour', 'Jag Mandir', 'Fateh Sagar Lake'],
        category: 'Historical'
      }
    ]);

    console.log(`Seeded ${destinations.length} destinations.`);

    const posts = await Post.create([
      {
        user: rahul._id,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop',
        caption: 'Monsoon ride to Tiger Point Lonavala! Carpooling saved us fuel costs and double the fun!',
        location: 'Tiger Point, Lonavala',
        likes: [ananya._id, users[3]._id],
        comments: [
          { user: ananya._id, text: 'Awesome view! Let me know next time you head out!' }
        ]
      },
      {
        user: ananya._id,
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop',
        caption: 'Sunset chaser in Goa! Planned our trip with TravelBuddy Expense Splitter - super easy!',
        location: 'Palolem Beach, Goa',
        likes: [rahul._id],
        comments: []
      }
    ]);

    console.log(`Seeded ${posts.length} community posts.`);

    await Trip.create({
      title: 'Monsoon Trek & Camping at Lohagad',
      destination: 'Lonavala',
      budget: 5000,
      startDate: today,
      endDate: today,
      creator: rahul._id,
      members: [rahul._id, ananya._id, users[3]._id],
      notes: 'Remember to pack extra raincoats and trek boots! Fuel expense will be split evenly.'
    });

    console.log('Database seeded successfully with 0 initial completed rides!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding Error:', err.message);
    process.exit(1);
  }
};

seedData();
