import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Search, 
  Map, 
  Thermometer, 
  Droplets, 
  Sun, 
  Wind, 
  Sparkles,
  Loader2,
  ChevronRight,
  Leaf,
  Info
} from 'lucide-react';
import axios from 'axios';
import apiClient from '../utils/api';

// Helper function to format image URLs
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = 'https://greenshelf-sh2b.onrender.com';
  return imagePath.startsWith('/') ? `${baseUrl}${imagePath}` : `${baseUrl}/${imagePath}`;
};

const RecommendationPage = () => {
  const [coordinates, setCoordinates] = useState(null);
  const [citySearch, setCitySearch] = useState('');
  const [weather, setWeather] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState('initial'); // initial, loading, results

  const OPENWEATHER_API_KEY = 'ec8a92a497452b7731c15b3f2836f9f9';
  const plantTips = [
    "Most indoor plants die from overwatering rather than underwatering.",
    "Plants with colorful leaves generally need more light than all-green plants.",
    "Dust your leaves! Thick dust can block sunlight and reduce photosynthesis.",
    "Rotate your plants regularly to ensure even growth on all sides.",
    "Spring and summer are the best times to repot or fertilize your plants."
  ];

  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setCurrentTip((prev) => (prev + 1) % plantTips.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleAutoLocation = () => {
    setLoading(true);
    setError(null);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchRecommendations(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          setLoading(false);
          setError("Location access denied. Please search for your city manually.");
        }
      );
    } else {
      setLoading(false);
      setError("Geolocation is not supported by your browser.");
    }
  };

  const handleCitySearch = async (e) => {
    e.preventDefault();
    if (!citySearch.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(citySearch)}&limit=1&appid=${OPENWEATHER_API_KEY}`
      );

      if (geoResponse.data && geoResponse.data.length > 0) {
        const { lat, lon, name } = geoResponse.data[0];
        fetchRecommendations(lat, lon, name);
      } else {
        setLoading(false);
        setError("City not found. Please try another name.");
      }
    } catch (err) {
      setLoading(false);
      setError("Failed to resolve city location. Check your connection.");
    }
  };

  const fetchRecommendations = async (lat, lon, cityName = null) => {
    setLoading(true);
    setActiveStep('loading');
    try {
      const response = await apiClient.get(`/recommend/plants?lat=${lat}&lon=${lon}`);
      setWeather(response.data.weather);
      setRecommendations(response.data.plants);
      setActiveStep('results');
    } catch (err) {
      setError(err.response?.data?.message || "Failed to get AI recommendations. Please try again later.");
      setActiveStep('initial');
    } finally {
      setLoading(false);
    }
  };

  const WeatherCard = ({ data }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-green-50 overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 p-12 opacity-5">
        <Sun className="w-48 h-48 text-green-600" />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h3 className="text-sm font-bold text-green-600 uppercase tracking-widest mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Your Local Environment
          </h3>
          <div className="flex items-end gap-2">
            <span className="text-6xl font-black text-gray-900">{Math.round(data.temperature)}°C</span>
            <span className="text-xl text-gray-500 font-medium mb-2 capitalize">{data.condition}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 w-full md:w-auto">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Droplets className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Humidity</p>
              <p className="text-xl font-bold text-gray-900">{data.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 rounded-2xl">
              <Sun className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Condition</p>
              <p className="text-xl font-bold text-gray-900">{data.condition}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const PlantCard = ({ plant }) => (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col h-full"
    >
      <div className="h-48 bg-gray-100 relative">
        <img 
          src={getImageUrl(plant.imageUrl) || `https://via.placeholder.com/300x200?text=${plant.commonName}`} 
          alt={plant.commonName}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
          <span className="text-xs font-bold text-green-600 uppercase">{plant.category}</span>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h4 className="text-xl font-bold text-gray-900 mb-1">{plant.commonName}</h4>
        <p className="text-xs text-gray-400 italic mb-4">{plant.scientificName}</p>
        
        <div className="space-y-3 mb-6 flex-1">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Sun className="w-4 h-4 text-orange-500" />
            <span>{plant.sunlight}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span>Water: {plant.wateringFrequency}</span>
          </div>
        </div>

        <button className="w-full py-3 bg-green-50 text-green-700 font-bold rounded-xl hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-2">
          View Detailed Care <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Step 1: Initial State */}
        <AnimatePresence mode="wait">
          {activeStep === 'initial' && (
            <motion.div 
              key="initial"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center max-w-2xl mx-auto py-20"
            >
              <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-3xl mb-8">
                <Sparkles className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">
                Your AI Plant <span className="text-green-600 underline decoration-green-200">Advisor</span>
              </h1>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                Discover the perfect indoor plants that will thrive in your specific local environment using AI and real-time weather data.
              </p>

              <div className="flex flex-col gap-4">
                <form onSubmit={handleCitySearch} className="relative group">
                  <input 
                    type="text" 
                    placeholder="Enter your city name (e.g. Pune, Mumbai)..." 
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    className="w-full h-16 px-6 pl-14 bg-white border-2 border-transparent shadow-lg rounded-2xl focus:border-green-500 focus:outline-none transition-all text-lg font-medium"
                  />
                  <Search className="absolute left-5 top-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  <button 
                    type="submit"
                    className="absolute right-3 top-3 px-6 h-10 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-sm"
                  >
                    Search
                  </button>
                </form>

                <div className="flex items-center gap-4 py-4 uppercase text-xs font-black text-gray-400 tracking-widest">
                  <div className="h-px flex-1 bg-gray-200"></div>
                  <span>OR</span>
                  <div className="h-px flex-1 bg-gray-200"></div>
                </div>

                <button 
                  onClick={handleAutoLocation}
                  className="w-full h-16 bg-white border-2 border-gray-100 text-gray-700 font-bold rounded-2xl shadow-md hover:bg-green-50 hover:border-green-200 transition-all flex items-center justify-center gap-3 text-lg"
                >
                  <MapPin className="w-6 h-6 text-green-600" /> Use My Current Location
                </button>
              </div>

              {error && (
                <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3">
                  <Info className="w-5 h-5" /> {error}
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Loading State */}
          {activeStep === 'loading' && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-32"
            >
              <div className="relative inline-block mb-12">
                <div className="w-32 h-32 border-4 border-green-100 rounded-full"></div>
                <div className="w-32 h-32 border-4 border-green-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Leaf className="w-12 h-12 text-green-600 animate-pulse" />
                </div>
              </div>
              
              <h2 className="text-3xl font-black text-gray-900 mb-4 animate-pulse">Running AI Prediction...</h2>
              <p className="text-lg text-gray-500 mb-12 max-w-md mx-auto">
                Our model on Render is warming up to find the best plants for you. This may take up to a minute.
              </p>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-sm mx-auto">
                <div className="flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-widest mb-4">
                  <Sparkles className="w-4 h-4" /> Did you know?
                </div>
                <p className="text-gray-700 font-medium italic">"{plantTips[currentTip]}"</p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Results State */}
          {activeStep === 'results' && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-4xl font-black text-gray-900 leading-tight">
                    Perfect Matches <br/> 
                    <span className="text-green-600 text-2xl font-bold">Based on your climate</span>
                  </h2>
                </div>
                <button 
                  onClick={() => setActiveStep('initial')}
                  className="px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
                >
                  <Map className="w-5 h-5" /> Change Location
                </button>
              </div>

              {weather && <WeatherCard data={weather} />}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendations.length > 0 ? (
                  recommendations.map((plant, index) => (
                    <PlantCard key={index} plant={plant} />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center">
                    <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No specific recommendations found for this weather. Try again!</p>
                  </div>
                )}
              </div>

              <div className="mt-20 p-8 bg-green-600 rounded-3xl text-center text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4">Want more personalized advice?</h3>
                  <p className="mb-8 text-green-50 opacity-90 max-w-xl mx-auto">
                    Sign up to save these recommendations and get weekly care notifications for your dream plants.
                  </p>
                  <button className="px-10 py-4 bg-white text-green-600 font-black rounded-2xl hover:bg-green-50 transition-colors shadow-xl">
                    Get Started Free
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default RecommendationPage;
