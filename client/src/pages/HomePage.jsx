import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Sparkles,
  ShieldCheck,
  CalendarCheck,
  MessageSquare,
  Award,
  ArrowRight,
  MapPin,
  TrendingUp,
  Users,
  CheckCircle2
} from 'lucide-react';
import PropertySearchBar from '../components/property/PropertySearchBar';
import PropertyGrid from '../components/property/PropertyGrid';
import Button from '../components/common/Button';
import { INDIAN_CITIES, PROPERTY_TYPES } from '../utils/constants';
import api from '../api/axios';

const CITY_CARDS = [
  {
    name: 'Noida',
    state: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80',
    count: '350+ Listings'
  },
  {
    name: 'Gurgaon',
    state: 'Haryana',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80',
    count: '420+ Listings'
  },
  {
    name: 'Bangalore',
    state: 'Karnataka',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80',
    count: '580+ Listings'
  },
  {
    name: 'Mumbai',
    state: 'Maharashtra',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
    count: '610+ Listings'
  },
  {
    name: 'Delhi',
    state: 'NCR',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80',
    count: '490+ Listings'
  },
  {
    name: 'Pune',
    state: 'Maharashtra',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=600&q=80',
    count: '290+ Listings'
  }
];

const HomePage = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featRes, recRes] = await Promise.all([
          api.get('/properties/featured'),
          api.get('/properties/recent')
        ]);
        if (featRes.data.success) setFeaturedProperties(featRes.data.properties);
        if (recRes.data.success) setRecentProperties(recRes.data.properties);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingFeatured(false);
        setLoadingRecent(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-24 sm:pt-20 sm:pb-32 overflow-hidden bg-gradient-to-b from-indigo-50/60 via-white to-slate-50 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950">
        {/* Background glow orb */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 hero-glow pointer-events-none opacity-80" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Discover Over 2,500+ Verified Properties across India</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15]">
            Find a place you'll{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-400 bg-clip-text text-transparent">
              love to live.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Discover luxury homes, modern apartments, villas, and prime commercial properties in your preferred location with direct agent scheduling and verified listings.
          </p>

          {/* Search Bar Component */}
          <div className="mt-10 sm:mt-12">
            <PropertySearchBar />
          </div>
        </div>
      </section>

      {/* 2. Platform Statistics Banner */}
      <section className="border-y border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">
              ₹500 Cr+
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Property Value Listed
            </p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              2,500+
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Verified Properties
            </p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
              99.2%
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Inspection Rating
            </p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-purple-600 dark:text-purple-400">
              15+
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Metro Indian Cities
            </p>
          </div>
        </div>
      </section>

      {/* 3. Featured Properties Section */}
      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                <Sparkles className="w-4 h-4" />
                Handpicked Collections
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Featured Properties
              </h2>
            </div>
            <Link to="/properties?isFeatured=true">
              <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                View All Featured
              </Button>
            </Link>
          </div>

          <PropertyGrid properties={featuredProperties} loading={loadingFeatured} skeletonCount={6} />
        </div>
      </section>

      {/* 4. Explore Popular Indian Cities */}
      <section className="py-16 sm:py-20 bg-white dark:bg-slate-900/50 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explore Popular Real Estate Hubs
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Find your dream residence across the most sought-after Indian metropolitan tech hubs and cultural capitals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CITY_CARDS.map((city) => (
              <Link
                key={city.name}
                to={`/properties?city=${city.name}`}
                className="group relative h-64 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block hover:-translate-y-1"
              >
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <div>
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                      {city.state}
                    </span>
                    <h3 className="text-2xl font-extrabold text-white">
                      {city.name}
                    </h3>
                  </div>
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/20 backdrop-blur-md text-white">
                    {city.count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Recently Added Properties */}
      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                Fresh On Market
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Recently Added Listings
              </h2>
            </div>
            <Link to="/properties">
              <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                Explore All Properties
              </Button>
            </Link>
          </div>

          <PropertyGrid properties={recentProperties} loading={loadingRecent} skeletonCount={6} />
        </div>
      </section>

      {/* 6. Why Choose EstateHub */}
      <section className="py-16 sm:py-20 bg-white dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Why Choose EstateHub?
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              We eliminate broker spam and misleading listings with an end-to-end verified real estate ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Admin Verified Listings
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Every agent listing undergoes mandatory administrative review and location verification before publishing.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                1-Click Site Tour Scheduling
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Choose preferred date and time slots without endless back-and-forth phone calls with real-time calendar confirmation.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Real-Time Messaging
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Chat directly with authorized property agents via encrypted WebSockets to get fast answers to your questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-2xl">
            Are You a Property Agent or Developer?
          </h2>
          <p className="text-sm sm:text-base text-indigo-200 max-w-xl">
            Join India's premier verified real estate network. List your luxury apartments, villas, and commercial properties today to reach high-intent buyers.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/register?role=AGENT">
              <Button size="lg" variant="secondary">
                Register as Property Agent
              </Button>
            </Link>
            <Link to="/properties">
              <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                Browse Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
