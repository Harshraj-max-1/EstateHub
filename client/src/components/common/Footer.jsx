import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Heart, Shield, CheckCircle2, ArrowUpRight, Phone, Mail, MapPin } from 'lucide-react';
import { INDIAN_CITIES } from '../../utils/constants';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Estate<span className="text-indigo-600 dark:text-indigo-400">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              EstateHub is India's next-generation real estate discovery and verified marketplace platform. Explore luxury apartments, independent villas, and prime commercial properties with transparent scheduling and direct agent messaging.
            </p>
            <div className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-500" />
                <span>Sector 62, Noida, Uttar Pradesh 201309</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-500" />
                <span>support@estatehub.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Explore
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link to="/properties?listingType=BUY" className="hover:text-indigo-600 transition-colors">
                  Properties for Sale
                </Link>
              </li>
              <li>
                <Link to="/properties?listingType=RENT" className="hover:text-indigo-600 transition-colors">
                  Properties for Rent
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=Apartment" className="hover:text-indigo-600 transition-colors">
                  Luxury Apartments
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=Villa" className="hover:text-indigo-600 transition-colors">
                  Independent Villas
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-indigo-600 transition-colors">
                  Property Comparison
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Top Locations
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400">
              {INDIAN_CITIES.slice(0, 5).map((city) => (
                <li key={city}>
                  <Link
                    to={`/properties?city=${city}`}
                    className="hover:text-indigo-600 transition-colors flex items-center justify-between group"
                  >
                    <span>{city} Real Estate</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust & Verification */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Platform Safety
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>Admin Verified Listings with Geo-Coordinates</span>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <span>Encrypted Direct Messaging & Scheduling</span>
              </div>
              <div className="flex items-start gap-2">
                <Heart className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>Zero Spam Guarantee with Report Moderation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} EstateHub Technologies Inc. Built with MERN Stack.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>RERA Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
