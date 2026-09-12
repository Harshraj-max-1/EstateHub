import React from 'react';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Bed, Bath, Square, ExternalLink } from 'lucide-react';
import { formatPrice, formatArea, getImageUrl } from '../../utils/formatters';

// Fix for default Leaflet marker icons in Vite bundler
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Brand Pin Icon
const createCustomIcon = (priceText) => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="
      background-color: #4f46e5;
      color: #ffffff;
      padding: 4px 8px;
      border-radius: 9999px;
      font-weight: 800;
      font-size: 11px;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
      border: 2px solid #ffffff;
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    ">${priceText}</div>`,
    iconSize: [60, 25],
    iconAnchor: [30, 12]
  });
};

const PropertyMapView = ({ properties = [], center = [28.5355, 77.3910], zoom = 11, className = 'h-[600px]' }) => {
  const mapCenter = properties.length > 0 && properties[0]?.location?.coordinates?.lat
    ? [properties[0].location.coordinates.lat, properties[0].location.coordinates.lng]
    : center;

  return (
    <div className={`w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md ${className}`}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {properties.map((prop) => {
          const lat = prop.location?.coordinates?.lat || 28.5355;
          const lng = prop.location?.coordinates?.lng || 77.3910;
          const priceFormatted = formatPrice(prop.price, prop.listingType);

          return (
            <Marker
              key={prop._id}
              position={[lat, lng]}
              icon={createCustomIcon(priceFormatted)}
            >
              <Popup className="custom-leaflet-popup">
                <div className="w-56 flex flex-col gap-2 p-1 font-sans">
                  <div className="relative h-28 w-full rounded-lg overflow-hidden">
                    <img
                      src={getImageUrl(prop.images?.[0]?.url)}
                      alt={prop.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white">
                      {priceFormatted}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {prop.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">
                    {prop.location?.locality}, {prop.location?.city}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-300 font-semibold pt-1 border-t border-slate-100">
                    <span>{prop.bedrooms ? `${prop.bedrooms} BHK` : prop.propertyType}</span>
                    <span>{formatArea(prop.area)}</span>
                  </div>

                  <Link
                    to={`/properties/${prop.slug || prop._id}`}
                    className="mt-1 w-full py-1.5 text-center text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center justify-center gap-1"
                  >
                    <span>View Property</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default PropertyMapView;
