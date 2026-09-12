require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Property = require('../models/Property');
const Favorite = require('../models/Favorite');
const Enquiry = require('../models/Enquiry');
const Appointment = require('../models/Appointment');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const Review = require('../models/Review');
const Report = require('../models/Report');
const PropertyView = require('../models/PropertyView');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/estatehub';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed]: Connected to MongoDB at', MONGODB_URI);

    // Clear all existing data
    await Promise.all([
      User.deleteMany(),
      Property.deleteMany(),
      Favorite.deleteMany(),
      Enquiry.deleteMany(),
      Appointment.deleteMany(),
      Conversation.deleteMany(),
      Message.deleteMany(),
      Notification.deleteMany(),
      Review.deleteMany(),
      Report.deleteMany(),
      PropertyView.deleteMany()
    ]);
    console.log('[Seed]: Cleared existing collections');

    // 1. Create Users
    const users = await User.create([
      {
        name: 'Super Admin',
        email: 'admin@estatehub.com',
        password: 'Admin@123',
        role: 'ADMIN',
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        bio: 'Chief Platform Administrator and Operations Manager at EstateHub.'
      },
      {
        name: 'Rajesh Sharma',
        email: 'agent.rajesh@estatehub.com',
        password: 'Agent@123',
        role: 'AGENT',
        phone: '+91 98111 22334',
        agencyName: 'Apex Luxe Realty',
        experienceYears: 8,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        bio: 'Specializing in premium residential condominiums and luxury villas across Delhi NCR and Noida.'
      },
      {
        name: 'Priya Menon',
        email: 'agent.priya@estatehub.com',
        password: 'Agent@123',
        role: 'AGENT',
        phone: '+91 98222 33445',
        agencyName: 'Skyline Prestige Homes',
        experienceYears: 6,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        bio: 'Top-tier commercial and high-end residential specialist in Bangalore and Mumbai.'
      },
      {
        name: 'Arun Verma',
        email: 'agent.arun@estatehub.com',
        password: 'Agent@123',
        role: 'AGENT',
        phone: '+91 98333 44556',
        agencyName: 'Heritage Living Group',
        experienceYears: 10,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        bio: 'Passionate about sustainable architecture, gated villa communities, and penthouses.'
      },
      {
        name: 'Rahul Kapoor',
        email: 'buyer.rahul@estatehub.com',
        password: 'Buyer@123',
        role: 'BUYER',
        phone: '+91 98444 55667',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
        bio: 'Software engineer looking for a modern 3BHK apartment in Noida/Gurgaon.'
      },
      {
        name: 'Sneha Patel',
        email: 'buyer.sneha@estatehub.com',
        password: 'Buyer@123',
        role: 'BUYER',
        phone: '+91 98555 66778',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        bio: 'Interior designer seeking a spacious penthouse or villa in Bangalore.'
      },
      {
        name: 'Amit Joshi',
        email: 'buyer.amit@estatehub.com',
        password: 'Buyer@123',
        role: 'BUYER',
        phone: '+91 98666 77889',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
        bio: 'Looking for prime commercial office space or rental property in Mumbai.'
      }
    ]);

    const admin = users[0];
    const agentRajesh = users[1];
    const agentPriya = users[2];
    const agentArun = users[3];
    const buyerRahul = users[4];
    const buyerSneha = users[5];
    const buyerAmit = users[6];

    console.log('[Seed]: Created 7 Users (1 Admin, 3 Agents, 3 Buyers)');

    // 2. Create 25 Realistic Properties across Indian Cities
    const propertiesData = [
      // NOIDA
      {
        title: 'ATS Pristine Ultra Luxury 3BHK Green Suite',
        description: 'Impeccably crafted 3BHK apartment located in the prime sector 150 of Noida. Offers seamless expressway connectivity, low-density green living, Olympic-size swimming pool, and Italian marble flooring.',
        price: 18500000, // 1.85 Cr
        propertyType: 'Apartment',
        listingType: 'BUY',
        status: 'APPROVED',
        isFeatured: true,
        bedrooms: 3,
        bathrooms: 3,
        area: 2150,
        floors: 18,
        parking: 2,
        furnishing: 'Semi-Furnished',
        constructionYear: 2023,
        location: {
          country: 'India',
          state: 'Uttar Pradesh',
          city: 'Noida',
          locality: 'Sector 150',
          address: 'ATS Pristine, Sector 150, Noida-Greater Noida Expressway',
          coordinates: { lat: 28.4385, lng: 77.4947 }
        },
        amenities: ['Swimming Pool', 'Gym', '24x7 Security', 'Clubhouse', 'Power Backup', 'Lift', 'Covered Parking', 'Balcony', 'Garden'],
        images: [
          { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', isPrimary: false },
          { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', isPrimary: false }
        ],
        agent: agentRajesh._id,
        viewsCount: 342,
        favoritesCount: 18
      },
      {
        title: 'Modern 2BHK Smart Home near Metro',
        description: 'Cozy and well-ventilated 2BHK apartment in Sector 137, Noida. Equipped with smart lighting, modular kitchen, and within walking distance to Sector 137 Metro Station.',
        price: 7500000, // 75 Lakh
        propertyType: 'Apartment',
        listingType: 'BUY',
        status: 'APPROVED',
        isFeatured: false,
        bedrooms: 2,
        bathrooms: 2,
        area: 1150,
        floors: 14,
        parking: 1,
        furnishing: 'Furnished',
        constructionYear: 2022,
        location: {
          country: 'India',
          state: 'Uttar Pradesh',
          city: 'Noida',
          locality: 'Sector 137',
          address: 'Paras Tierea, Sector 137, Noida',
          coordinates: { lat: 28.5135, lng: 77.4048 }
        },
        amenities: ['Gym', '24x7 Security', 'Power Backup', 'Lift', 'Balcony', 'CCTV'],
        images: [
          { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', isPrimary: false }
        ],
        agent: agentRajesh._id,
        viewsCount: 210,
        favoritesCount: 9
      },
      {
        title: 'Grand 4BHK Sky Penthouse with Terrace Garden',
        description: 'Exquisite duplex penthouse featuring a private 900 sqft terrace garden, panoramic city views, VRV central air-conditioning, and 3 reserved basement car parks.',
        price: 39000000, // 3.90 Cr
        propertyType: 'Penthouse',
        listingType: 'BUY',
        status: 'APPROVED',
        isFeatured: true,
        bedrooms: 4,
        bathrooms: 5,
        area: 4200,
        floors: 32,
        parking: 3,
        furnishing: 'Furnished',
        constructionYear: 2024,
        location: {
          country: 'India',
          state: 'Uttar Pradesh',
          city: 'Noida',
          locality: 'Sector 78',
          address: 'Mahagun Moderne, Sector 78, Central Noida',
          coordinates: { lat: 28.5712, lng: 77.3828 }
        },
        amenities: ['Swimming Pool', 'Gym', '24x7 Security', 'Clubhouse', 'Power Backup', 'Lift', 'Garden', 'Balcony', 'CCTV', 'Covered Parking'],
        images: [
          { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80', isPrimary: false }
        ],
        agent: agentRajesh._id,
        viewsCount: 480,
        favoritesCount: 31
      },

      // GURGAON
      {
        title: 'DLF Magnolias Golf View Signature Residence',
        description: 'World-renowned luxury apartment overlooking the DLF Golf Course. Features bespoke woodwork, private elevator access, concierge services, and ultra-high-end fixtures.',
        price: 98000000, // 9.8 Cr
        propertyType: 'Apartment',
        listingType: 'BUY',
        status: 'APPROVED',
        isFeatured: true,
        bedrooms: 4,
        bathrooms: 5,
        area: 5800,
        floors: 24,
        parking: 4,
        furnishing: 'Furnished',
        constructionYear: 2023,
        location: {
          country: 'India',
          state: 'Haryana',
          city: 'Gurgaon',
          locality: 'Golf Course Road',
          address: 'DLF The Magnolias, Sector 42, Golf Course Road, Gurgaon',
          coordinates: { lat: 28.4682, lng: 77.0945 }
        },
        amenities: ['Swimming Pool', 'Gym', '24x7 Security', 'Clubhouse', 'Power Backup', 'Lift', 'Covered Parking', 'Balcony', 'Garden', 'CCTV'],
        images: [
          { url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80', isPrimary: false }
        ],
        agent: agentArun._id,
        viewsCount: 650,
        favoritesCount: 45
      },
      {
        title: 'Spacious 3BHK Rental Condo near Cyber City',
        description: 'Fully furnished 3BHK ready for immediate move-in. Located 5 minutes away from DLF Cyber Hub and Rapid Metro. Ideal for corporate executives.',
        price: 65000, // 65k / month rent
        propertyType: 'Apartment',
        listingType: 'RENT',
        status: 'APPROVED',
        isFeatured: false,
        bedrooms: 3,
        bathrooms: 3,
        area: 1750,
        floors: 12,
        parking: 2,
        furnishing: 'Furnished',
        constructionYear: 2021,
        location: {
          country: 'India',
          state: 'Haryana',
          city: 'Gurgaon',
          locality: 'DLF Phase 2',
          address: 'Oakwood Estate, DLF Phase 2, Gurgaon',
          coordinates: { lat: 28.4905, lng: 77.0863 }
        },
        amenities: ['Gym', '24x7 Security', 'Power Backup', 'Lift', 'Balcony', 'Covered Parking'],
        images: [
          { url: 'https://images.unsplash.com/photo-1502005229762-ee1b2da97e06?auto=format&fit=crop&w=1200&q=80', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80', isPrimary: false }
        ],
        agent: agentArun._id,
        viewsCount: 310,
        favoritesCount: 14
      },
      {
        title: 'Modern Independent Villa in Sohna Road Gated Estate',
        description: 'Private 4BHK triplex villa with landscaped backyard, Italian kitchen, home theatre room, and private solar power setup.',
        price: 42500000, // 4.25 Cr
        propertyType: 'Villa',
        listingType: 'BUY',
        status: 'APPROVED',
        isFeatured: true,
        bedrooms: 4,
        bathrooms: 5,
        area: 3800,
        floors: 3,
        parking: 2,
        furnishing: 'Semi-Furnished',
        constructionYear: 2023,
        location: {
          country: 'India',
          state: 'Haryana',
          city: 'Gurgaon',
          locality: 'Sohna Road',
          address: 'Eldeco Mansionz, Sector 48, Sohna Road, Gurgaon',
          coordinates: { lat: 28.4198, lng: 77.0423 }
        },
        amenities: ['Garden', 'Swimming Pool', 'Clubhouse', '24x7 Security', 'Power Backup', 'Covered Parking', 'CCTV'],
        images: [
          { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80', isPrimary: false }
        ],
        agent: agentArun._id,
        viewsCount: 420,
        favoritesCount: 22
      },

      // DELHI
      {
        title: 'Heritage Architectural Villa in Vasant Vihar',
        description: 'Ultra-exclusive 5BHK luxury bungalow located in South Delhi diplomatic zone. Expansive front lawns, imported marble interiors, servant quarters, and high-security perimeter.',
        price: 180000000, // 18 Cr
        propertyType: 'Villa',
        listingType: 'BUY',
        status: 'APPROVED',
        isFeatured: true,
        bedrooms: 5,
        bathrooms: 6,
        area: 6500,
        floors: 3,
        parking: 4,
        furnishing: 'Furnished',
        constructionYear: 2022,
        location: {
          country: 'India',
          state: 'Delhi',
          city: 'Delhi',
          locality: 'Vasant Vihar',
          address: 'Block E, Vasant Vihar, South Delhi',
          coordinates: { lat: 28.5603, lng: 77.1614 }
        },
        amenities: ['Garden', '24x7 Security', 'Power Backup', 'Covered Parking', 'CCTV', 'Clubhouse'],
        images: [
          { url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', isPrimary: false }
        ],
        agent: agentRajesh._id,
        viewsCount: 890,
        favoritesCount: 52
      },
      {
        title: 'Chic 3BHK Builder Floor in Greater Kailash II',
        description: 'Newly constructed 3BHK builder floor with lift, stilt parking, German modular kitchen, and walking distance to M-Block market.',
        price: 32000000, // 3.20 Cr
        propertyType: 'Independent House',
        listingType: 'BUY',
        status: 'APPROVED',
        isFeatured: false,
        bedrooms: 3,
        bathrooms: 3,
        area: 2200,
        floors: 4,
        parking: 2,
        furnishing: 'Semi-Furnished',
        constructionYear: 2024,
        location: {
          country: 'India',
          state: 'Delhi',
          city: 'Delhi',
          locality: 'Greater Kailash II',
          address: 'W-Block, GK 2, New Delhi',
          coordinates: { lat: 28.5323, lng: 77.2424 }
        },
        amenities: ['Lift', 'Covered Parking', '24x7 Security', 'Power Backup', 'Balcony'],
        images: [
          { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=80', isPrimary: false }
        ],
        agent: agentRajesh._id,
        viewsCount: 380,
        favoritesCount: 20
      },
      {
        title: 'Studio Apartment for Rent in Hauz Khas',
        description: 'Bohemian styled studio apartment overlooking Hauz Khas Deer Park. Fully equipped with WiFi, kitchen appliances, and trendy rooftop sit-out.',
        price: 35000, // 35k rent
        propertyType: 'Studio',
        listingType: 'RENT',
        status: 'APPROVED',
        isFeatured: false,
        bedrooms: 1,
        bathrooms: 1,
        area: 650,
        floors: 3,
        parking: 1,
        furnishing: 'Furnished',
        constructionYear: 2021,
        location: {
          country: 'India',
          state: 'Delhi',
          city: 'Delhi',
          locality: 'Hauz Khas',
          address: 'Hauz Khas Village Road, New Delhi',
          coordinates: { lat: 28.5494, lng: 77.2001 }
        },
        amenities: ['Power Backup', 'Balcony', '24x7 Security', 'CCTV'],
        images: [
          { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', isPrimary: true }
        ],
        agent: agentRajesh._id,
        viewsCount: 290,
        favoritesCount: 16
      },

      // BANGALORE
      {
        title: 'Prestige Lakeside Habitat 3BHK Luxury Flat',
        description: 'Overlooking the picturesque Varthur Lake, this luxury 3BHK flat offers resort living, 4 massive clubhouses, tennis courts, and close proximity to ITPL.',
        price: 16500000, // 1.65 Cr
        propertyType: 'Apartment',
        listingType: 'BUY',
        status: 'APPROVED',
        isFeatured: true,
        bedrooms: 3,
        bathrooms: 3,
        area: 1980,
        floors: 22,
        parking: 2,
        furnishing: 'Semi-Furnished',
        constructionYear: 2023,
        location: {
          country: 'India',
          state: 'Karnataka',
          city: 'Bangalore',
          locality: 'Whitefield',
          address: 'Prestige Lakeside Habitat, Varthur Main Rd, Whitefield, Bangalore',
          coordinates: { lat: 12.9569, lng: 77.7412 }
        },
        amenities: ['Swimming Pool', 'Gym', '24x7 Security', 'Clubhouse', 'Power Backup', 'Lift', 'Garden', 'Covered Parking', 'Balcony'],
        images: [
          { url: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80', isPrimary: false }
        ],
        agent: agentPriya._id,
        viewsCount: 520,
        favoritesCount: 29
      },
      {
        title: 'Boutique 4BHK Villa in Indiranagar',
        description: 'Architect-designed tropical modern villa with private plunge pool, courtyard waterbody, rooftop barbecue deck, and 100% solar backup.',
        price: 68000000, // 6.8 Cr
        propertyType: 'Villa',
        listingType: 'BUY',
        status: 'APPROVED',
        isFeatured: true,
        bedrooms: 4,
        bathrooms: 4,
        area: 4100,
        floors: 3,
        parking: 2,
        furnishing: 'Furnished',
        constructionYear: 2023,
        location: {
          country: 'India',
          state: 'Karnataka',
          city: 'Bangalore',
          locality: 'Indiranagar',
          address: '100ft Road, 12th Main, Indiranagar, Bangalore',
          coordinates: { lat: 12.9719, lng: 77.6412 }
        },
        amenities: ['Swimming Pool', 'Garden', '24x7 Security', 'Power Backup', 'Covered Parking', 'CCTV'],
        images: [
          { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', isPrimary: false }
        ],
        agent: agentPriya._id,
        viewsCount: 710,
        favoritesCount: 42
      },
      {
        title: 'Grade-A Commercial Office Space in Koramangala',
        description: 'Furnished plug-and-play startup office space with 45 workstations, 2 conference rooms, director cabin, and cafeteria.',
        price: 180000, // 1.8 Lakh rent
        propertyType: 'Commercial',
        listingType: 'RENT',
        status: 'APPROVED',
        isFeatured: false,
        bedrooms: 0,
        bathrooms: 2,
        area: 3200,
        floors: 5,
        parking: 5,
        furnishing: 'Furnished',
        constructionYear: 2022,
        location: {
          country: 'India',
          state: 'Karnataka',
          city: 'Bangalore',
          locality: 'Koramangala',
          address: '80ft Road, 4th Block, Koramangala, Bangalore',
          coordinates: { lat: 12.9352, lng: 77.6245 }
        },
        amenities: ['Power Backup', 'Lift', '24x7 Security', 'Covered Parking', 'CCTV'],
        images: [
          { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', isPrimary: true }
        ],
        agent: agentPriya._id,
        viewsCount: 310,
        favoritesCount: 11
      },

      // MUMBAI
      {
        title: 'Bandra West Sea-Facing 3BHK Luxury Haven',
        description: 'Breathtaking Arabian Sea views from every room! Features floor-to-ceiling soundproof glass facades, Italian marble, and automated lighting systems.',
        price: 85000000, // 8.5 Cr
        propertyType: 'Apartment',
        listingType: 'BUY',
        status: 'APPROVED',
        isFeatured: true,
        bedrooms: 3,
        bathrooms: 4,
        area: 2100,
        floors: 26,
        parking: 2,
        furnishing: 'Furnished',
        constructionYear: 2023,
        location: {
          country: 'India',
          state: 'Maharashtra',
          city: 'Mumbai',
          locality: 'Bandra West',
          address: 'Carter Road, Bandra West, Mumbai',
          coordinates: { lat: 19.0607, lng: 72.8258 }
        },
        amenities: ['Swimming Pool', 'Gym', '24x7 Security', 'Clubhouse', 'Power Backup', 'Lift', 'Covered Parking', 'Balcony', 'CCTV'],
        images: [
          { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', isPrimary: false }
        ],
        agent: agentPriya._id,
        viewsCount: 940,
        favoritesCount: 65
      },
      {
        title: 'Luxury 2BHK Apartment for Rent in Powai Hiranandani',
        description: 'Elegant neo-classical living in Hiranandani Gardens, Powai. Lake views, central shopping boulevards, tennis academies, and clubhouse access.',
        price: 80000, // 80k rent
        propertyType: 'Apartment',
        listingType: 'RENT',
        status: 'APPROVED',
        isFeatured: false,
        bedrooms: 2,
        bathrooms: 2,
        area: 1050,
        floors: 28,
        parking: 1,
        furnishing: 'Furnished',
        constructionYear: 2022,
        location: {
          country: 'India',
          state: 'Maharashtra',
          city: 'Mumbai',
          locality: 'Powai',
          address: 'Hiranandani Gardens, Powai, Mumbai',
          coordinates: { lat: 19.1176, lng: 72.9060 }
        },
        amenities: ['Gym', 'Swimming Pool', '24x7 Security', 'Clubhouse', 'Lift', 'Power Backup'],
        images: [
          { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', isPrimary: true }
        ],
        agent: agentPriya._id,
        viewsCount: 420,
        favoritesCount: 19
      },

      // PUNE
      {
        title: 'Tranquil 4BHK Penthouse in Koregaon Park',
        description: 'Surrounded by Pune’s lush green canopy, this duplex penthouse features a private plunge pool, teakwood decks, and Italian modular fittings.',
        price: 36000000, // 3.6 Cr
        propertyType: 'Penthouse',
        listingType: 'BUY',
        status: 'APPROVED',
        isFeatured: true,
        bedrooms: 4,
        bathrooms: 4,
        area: 3400,
        floors: 14,
        parking: 2,
        furnishing: 'Semi-Furnished',
        constructionYear: 2023,
        location: {
          country: 'India',
          state: 'Maharashtra',
          city: 'Pune',
          locality: 'Koregaon Park',
          address: 'Lane 5, Koregaon Park, Pune',
          coordinates: { lat: 18.5362, lng: 73.8958 }
        },
        amenities: ['Swimming Pool', 'Gym', '24x7 Security', 'Clubhouse', 'Power Backup', 'Lift', 'Balcony', 'Covered Parking'],
        images: [
          { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', isPrimary: false }
        ],
        agent: agentArun._id,
        viewsCount: 390,
        favoritesCount: 23
      },
      {
        title: 'Spacious 3BHK in Baner High-Rise',
        description: 'Vastu-compliant 3BHK apartment in prime Baner with highway connectivity to Hinjawadi IT Park. Premium wooden flooring in master bedroom.',
        price: 13500000, // 1.35 Cr
        propertyType: 'Apartment',
        listingType: 'BUY',
        status: 'APPROVED',
        isFeatured: false,
        bedrooms: 3,
        bathrooms: 3,
        area: 1620,
        floors: 16,
        parking: 2,
        furnishing: 'Semi-Furnished',
        constructionYear: 2023,
        location: {
          country: 'India',
          state: 'Maharashtra',
          city: 'Pune',
          locality: 'Baner',
          address: 'Baner-Pashan Link Road, Pune',
          coordinates: { lat: 18.5590, lng: 73.7868 }
        },
        amenities: ['Gym', '24x7 Security', 'Power Backup', 'Lift', 'Balcony', 'Covered Parking', 'Clubhouse'],
        images: [
          { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', isPrimary: true }
        ],
        agent: agentArun._id,
        viewsCount: 280,
        favoritesCount: 15
      },

      // HYDERABAD
      {
        title: 'Gachibowli Gated Villa Community',
        description: 'Exclusive 4BHK triplex villa inside a secure gated enclave in Hyderabad’s Financial District. Private garden, 2-car garage, and 25,000 sqft clubhouse.',
        price: 52000000, // 5.2 Cr
        propertyType: 'Villa',
        listingType: 'BUY',
        status: 'APPROVED',
        isFeatured: true,
        bedrooms: 4,
        bathrooms: 5,
        area: 4400,
        floors: 3,
        parking: 2,
        furnishing: 'Semi-Furnished',
        constructionYear: 2024,
        location: {
          country: 'India',
          state: 'Telangana',
          city: 'Hyderabad',
          locality: 'Gachibowli',
          address: 'Financial District, Nanakramguda, Gachibowli, Hyderabad',
          coordinates: { lat: 17.4123, lng: 78.3498 }
        },
        amenities: ['Swimming Pool', 'Gym', '24x7 Security', 'Clubhouse', 'Power Backup', 'Garden', 'Covered Parking', 'CCTV'],
        images: [
          { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', isPrimary: false }
        ],
        agent: agentArun._id,
        viewsCount: 460,
        favoritesCount: 28
      },
      {
        title: 'Modern 3BHK Flat in Hitec City',
        description: 'Walk-to-work lifestyle near Cyber Towers. Features granite kitchen countertops, fiber internet pre-wiring, and panoramic balcony views.',
        price: 15500000, // 1.55 Cr
        propertyType: 'Apartment',
        listingType: 'BUY',
        status: 'APPROVED',
        isFeatured: false,
        bedrooms: 3,
        bathrooms: 3,
        area: 1850,
        floors: 20,
        parking: 2,
        furnishing: 'Semi-Furnished',
        constructionYear: 2023,
        location: {
          country: 'India',
          state: 'Telangana',
          city: 'Hyderabad',
          locality: 'Hitec City',
          address: 'Madhapur, Hitec City, Hyderabad',
          coordinates: { lat: 17.4474, lng: 78.3762 }
        },
        amenities: ['Gym', 'Swimming Pool', '24x7 Security', 'Power Backup', 'Lift', 'Balcony'],
        images: [
          { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', isPrimary: true }
        ],
        agent: agentArun._id,
        viewsCount: 310,
        favoritesCount: 17
      },

      // PATNA
      {
        title: 'Premium 3BHK Independent Floor on Bailey Road',
        description: 'Prime location on Bailey Road, Patna. Equipped with modern lift, 100% generator backup, modular fittings, and secure covered parking.',
        price: 9500000, // 95 Lakh
        propertyType: 'Independent House',
        listingType: 'BUY',
        status: 'APPROVED',
        isFeatured: false,
        bedrooms: 3,
        bathrooms: 2,
        area: 1550,
        floors: 4,
        parking: 1,
        furnishing: 'Semi-Furnished',
        constructionYear: 2023,
        location: {
          country: 'India',
          state: 'Bihar',
          city: 'Patna',
          locality: 'Bailey Road',
          address: 'Near Saguna More, Bailey Road, Patna',
          coordinates: { lat: 25.6127, lng: 85.0442 }
        },
        amenities: ['Lift', 'Power Backup', '24x7 Security', 'Covered Parking', 'Balcony'],
        images: [
          { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', isPrimary: true }
        ],
        agent: agentRajesh._id,
        viewsCount: 270,
        favoritesCount: 12
      },
      {
        title: 'Commercial Retail Showroom in Boring Road',
        description: 'High footfall ground floor commercial showroom space in Patna’s premier commercial hub. Glass facade and dedicated customer parking.',
        price: 120000, // 1.2 Lakh rent
        propertyType: 'Commercial',
        listingType: 'RENT',
        status: 'APPROVED',
        isFeatured: false,
        bedrooms: 0,
        bathrooms: 1,
        area: 1400,
        floors: 3,
        parking: 2,
        furnishing: 'Unfurnished',
        constructionYear: 2022,
        location: {
          country: 'India',
          state: 'Bihar',
          city: 'Patna',
          locality: 'Boring Road',
          address: 'Boring Canal Road, Patna',
          coordinates: { lat: 25.6186, lng: 85.1215 }
        },
        amenities: ['Power Backup', '24x7 Security', 'CCTV', 'Covered Parking'],
        images: [
          { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', isPrimary: true }
        ],
        agent: agentRajesh._id,
        viewsCount: 190,
        favoritesCount: 8
      },

      // PENDING LISTINGS (For Admin Approval Queue Testing)
      {
        title: 'Upcoming DLF Cyber City Luxury 4BHK Suite',
        description: 'Ultra-exclusive residential suite currently undergoing final finishing. Features imported Italian fixtures and private elevator foyer.',
        price: 49000000,
        propertyType: 'Apartment',
        listingType: 'BUY',
        status: 'PENDING', // PENDING for admin review
        isFeatured: false,
        bedrooms: 4,
        bathrooms: 4,
        area: 3200,
        floors: 18,
        parking: 2,
        furnishing: 'Semi-Furnished',
        constructionYear: 2024,
        location: {
          country: 'India',
          state: 'Haryana',
          city: 'Gurgaon',
          locality: 'Cyber City',
          address: 'Phase 3, Cyber City, Gurgaon',
          coordinates: { lat: 28.4986, lng: 77.0878 }
        },
        amenities: ['Swimming Pool', 'Gym', '24x7 Security', 'Clubhouse', 'Power Backup', 'Lift', 'Balcony', 'Covered Parking'],
        images: [
          { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80', isPrimary: true }
        ],
        agent: agentArun._id,
        viewsCount: 10,
        favoritesCount: 0
      },
      {
        title: 'Modern Waterfront Studio in Worli Sea Face',
        description: 'Compact studio flat with stunning sunset views across the Bandra-Worli Sea Link.',
        price: 55000,
        propertyType: 'Studio',
        listingType: 'RENT',
        status: 'PENDING', // PENDING for admin review
        isFeatured: false,
        bedrooms: 1,
        bathrooms: 1,
        area: 550,
        floors: 15,
        parking: 1,
        furnishing: 'Furnished',
        constructionYear: 2023,
        location: {
          country: 'India',
          state: 'Maharashtra',
          city: 'Mumbai',
          locality: 'Worli',
          address: 'Worli Sea Face, Mumbai',
          coordinates: { lat: 19.0144, lng: 72.8152 }
        },
        amenities: ['Lift', '24x7 Security', 'Power Backup', 'CCTV'],
        images: [
          { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', isPrimary: true }
        ],
        agent: agentPriya._id,
        viewsCount: 8,
        favoritesCount: 0
      }
    ];

    const properties = await Property.create(propertiesData);
    console.log(`[Seed]: Created ${properties.length} Realistic Properties`);

    // 3. Create Sample Favorites for Buyer Rahul & Sneha
    await Favorite.create([
      { user: buyerRahul._id, property: properties[0]._id },
      { user: buyerRahul._id, property: properties[3]._id },
      { user: buyerSneha._id, property: properties[9]._id },
      { user: buyerSneha._id, property: properties[10]._id },
      { user: buyerAmit._id, property: properties[12]._id }
    ]);
    console.log('[Seed]: Created Sample Favorites');

    // 4. Create Sample Enquiries
    await Enquiry.create([
      {
        property: properties[0]._id,
        user: buyerRahul._id,
        agent: agentRajesh._id,
        name: 'Rahul Kapoor',
        email: 'buyer.rahul@estatehub.com',
        phone: '+91 98444 55667',
        message: 'Hi Rajesh, I am interested in viewing this 3BHK flat in Sector 150. Is the price negotiable for immediate registry?',
        status: 'NEW'
      },
      {
        property: properties[3]._id,
        user: buyerRahul._id,
        agent: agentArun._id,
        name: 'Rahul Kapoor',
        email: 'buyer.rahul@estatehub.com',
        phone: '+91 98444 55667',
        message: 'Hello, what are the society maintenance charges for the DLF Magnolias residence?',
        status: 'CONTACTED',
        agentResponse: 'Maintenance is approx ₹18/sqft monthly including golf clubhouse access.'
      },
      {
        property: properties[9]._id,
        user: buyerSneha._id,
        agent: agentPriya._id,
        name: 'Sneha Patel',
        email: 'buyer.sneha@estatehub.com',
        phone: '+91 98555 66778',
        message: 'Interested in the Prestige Lakeside property. Are bank loan pre-approvals available from SBI/HDFC?',
        status: 'IN_PROGRESS',
        agentResponse: 'Yes, this project is approved by SBI, HDFC, and ICICI with quick 48-hr loan sanctions.'
      }
    ]);
    console.log('[Seed]: Created Sample Enquiries');

    // 5. Create Sample Appointments
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 5);

    await Appointment.create([
      {
        property: properties[0]._id,
        user: buyerRahul._id,
        agent: agentRajesh._id,
        visitDate: tomorrow,
        timeSlot: '11:00 AM - 12:00 PM',
        message: 'Looking forward to meeting and taking a tour of the sample flat.',
        status: 'CONFIRMED',
        agentNotes: 'Confirmed. Meeting point: Main clubhouse gate.'
      },
      {
        property: properties[3]._id,
        user: buyerRahul._id,
        agent: agentArun._id,
        visitDate: nextWeek,
        timeSlot: '03:00 PM - 04:00 PM',
        message: 'Weekend visit preferred if possible.',
        status: 'PENDING'
      },
      {
        property: properties[10]._id,
        user: buyerSneha._id,
        agent: agentPriya._id,
        visitDate: tomorrow,
        timeSlot: '04:00 PM - 05:00 PM',
        message: 'Would love to inspect the Indiranagar villa.',
        status: 'CONFIRMED',
        agentNotes: 'Key is with property manager on site.'
      }
    ]);
    console.log('[Seed]: Created Sample Appointments');

    // 6. Create Sample Reviews
    await Review.create([
      {
        agent: agentRajesh._id,
        user: buyerRahul._id,
        property: properties[0]._id,
        rating: 5,
        comment: 'Rajesh was extremely professional, punctual, and guided us thoroughly through the registry and loan process. Highly recommended!'
      },
      {
        agent: agentPriya._id,
        user: buyerSneha._id,
        property: properties[9]._id,
        rating: 5,
        comment: 'Priya provided honest insights into the property and neighborhood. Seamless visit experience!'
      },
      {
        agent: agentArun._id,
        user: buyerAmit._id,
        property: properties[3]._id,
        rating: 4,
        comment: 'Very knowledgeable about DLF and luxury golf properties in Gurgaon.'
      }
    ]);
    console.log('[Seed]: Created Sample Reviews');

    // 7. Create Sample Reports (For Admin Moderation Queue Testing)
    await Report.create([
      {
        property: properties[1]._id,
        reporter: buyerAmit._id,
        reason: 'Incorrect information',
        description: 'Listing says 2 covered parkings in text, but property specs indicate 1.',
        status: 'PENDING'
      }
    ]);
    console.log('[Seed]: Created Sample Reports');

    // 8. Create Sample Chat Conversation & Messages
    const conversation = await Conversation.create({
      participants: [buyerRahul._id, agentRajesh._id],
      property: properties[0]._id,
      lastMessageText: 'Great, see you on Saturday at 11 AM!',
      lastMessageAt: new Date()
    });

    const msg1 = await Message.create({
      conversation: conversation._id,
      sender: buyerRahul._id,
      receiver: agentRajesh._id,
      content: 'Hi Rajesh, is the ATS Pristine 3BHK flat still available for site visit this weekend?'
    });

    const msg2 = await Message.create({
      conversation: conversation._id,
      sender: agentRajesh._id,
      receiver: buyerRahul._id,
      content: 'Hello Rahul! Yes, absolutely. I have confirmed your appointment for Saturday at 11 AM.'
    });

    const msg3 = await Message.create({
      conversation: conversation._id,
      sender: buyerRahul._id,
      receiver: agentRajesh._id,
      content: 'Great, see you on Saturday at 11 AM!'
    });

    conversation.lastMessage = msg3._id;
    await conversation.save();

    console.log('[Seed]: Created Sample Conversation & Messages');

    // 9. Create Sample Notifications
    await Notification.create([
      {
        recipient: agentRajesh._id,
        sender: buyerRahul._id,
        type: 'ENQUIRY_RECEIVED',
        title: 'New Property Enquiry Received',
        message: 'Rahul Kapoor enquired about "ATS Pristine Ultra Luxury 3BHK Green Suite".',
        link: '/agent/enquiries',
        isRead: false
      },
      {
        recipient: buyerRahul._id,
        sender: agentRajesh._id,
        type: 'APPOINTMENT_STATUS',
        title: 'Visit Request CONFIRMED',
        message: 'Rajesh Sharma confirmed your visit request for "ATS Pristine Ultra Luxury 3BHK Green Suite".',
        link: '/my-appointments',
        isRead: false
      },
      {
        recipient: admin._id,
        sender: agentArun._id,
        type: 'SYSTEM',
        title: 'New Property Listing Pending Approval',
        message: 'Arun Verma submitted "Upcoming DLF Cyber City Luxury 4BHK Suite" for review.',
        link: '/admin/properties',
        isRead: false
      }
    ]);
    console.log('[Seed]: Created Sample Notifications');

    // 10. Create 7 Days of Time-Series Property Views for Recharts
    const viewsList = [];
    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
      const viewDate = new Date();
      viewDate.setDate(viewDate.getDate() - dayOffset);

      // Add 8-15 views per day for Rajesh's properties
      const count = Math.floor(Math.random() * 10) + 8;
      for (let i = 0; i < count; i++) {
        viewsList.push({
          property: properties[0]._id,
          agent: agentRajesh._id,
          ip: `192.168.1.${Math.floor(Math.random() * 200)}`,
          viewedAt: viewDate
        });
      }
    }
    await PropertyView.insertMany(viewsList);
    console.log(`[Seed]: Created ${viewsList.length} Time-Series View Records`);

    console.log('\n======================================================');
    console.log('🎉 ESTATEHUB DATABASE SEEDED SUCCESSFULLY!');
    console.log('======================================================');
    console.log('Demo Credentials:');
    console.log('  👑 Admin: admin@estatehub.com / Admin@123');
    console.log('  🏢 Agent 1 (Noida/Delhi): agent.rajesh@estatehub.com / Agent@123');
    console.log('  🏢 Agent 2 (Bangalore/Mumbai): agent.priya@estatehub.com / Agent@123');
    console.log('  🏢 Agent 3 (Gurgaon/Pune): agent.arun@estatehub.com / Agent@123');
    console.log('  👤 Buyer 1: buyer.rahul@estatehub.com / Buyer@123');
    console.log('  👤 Buyer 2: buyer.sneha@estatehub.com / Buyer@123');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Database Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
