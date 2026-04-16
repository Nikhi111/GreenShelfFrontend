import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Leaf, Sun, Droplets, Flower2, ShoppingCart, Star,
  ArrowRight, ShieldCheck, Truck, Clock, Heart,
  Send, Sprout, MapPin
} from 'lucide-react';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';
import { productService } from '../services/productService';

// Helper function to format image URLs
const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/api/placeholder/300/200';
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('https://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path starting with /api, it's probably from a different server
  if (imagePath.startsWith('/api/')) {
    return imagePath;
  }
  
  // If it's a relative path without leading slash, add backend base URL
  if (!imagePath.startsWith('/')) {
    return `https://greenshelf-sh2b.onrender.com/${imagePath}`;
  }
  
  // If it starts with / but not /api, add backend base URL
  if (imagePath.startsWith('/') && !imagePath.startsWith('/api/')) {
    return `https://greenshelf-sh2b.onrender.com${imagePath}`;
  }
  
  // Default fallback
  return imagePath;
};

// --- MOCK DATA ---
const MOCK_CATEGORIES = [
  { id: 1, name: 'Indoor Plants', icon: <Leaf size={40} />, color: 'bg-green-100 text-green-700' },
  { id: 2, name: 'Outdoor Plants', icon: <Sun size={40} />, color: 'bg-yellow-100 text-yellow-600' },
  { id: 3, name: 'Succulents', icon: <Droplets size={40} />, color: 'bg-sky-100 text-sky-600' },
  { id: 4, name: 'Flowering', icon: <Flower2 size={40} />, color: 'bg-pink-100 text-pink-600' }
];

const MOCK_PLANTS = [
  {
    id: 1,
    name: 'Monstera Deliciosa',
    price: 45.99,
    rating: 4.8,
    nursery: 'Green Haven Nursery',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    badge: 'Bestseller'
  },
  {
    id: 2,
    name: 'Fiddle Leaf Fig',
    price: 55.00,
    rating: 4.9,
    nursery: 'Urban Roots',
    image: 'https://images.unsplash.com/photo-1597055181300-e3633a207517?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    badge: 'Trending'
  },
  {
    id: 3,
    name: 'Snake Plant',
    price: 25.50,
    rating: 4.7,
    nursery: 'Eco Flora',
    image: 'https://images.unsplash.com/photo-1593482892290-f54927eba703?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    name: 'Peace Lily',
    price: 32.00,
    rating: 4.6,
    nursery: 'Green Haven Nursery',
    image: 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    badge: 'Easy Care'
  }
];

const MOCK_NURSERIES = [
  { id: 1, name: 'Green Haven', location: 'Seattle, WA', rating: 4.9, products: 120 },
  { id: 2, name: 'Urban Roots', location: 'Portland, OR', rating: 4.8, products: 85 },
  { id: 3, name: 'Eco Flora', location: 'Austin, TX', rating: 4.7, products: 200 }
];

const MOCK_FEATURES = [
  { id: 1, title: 'Verified Nurseries', description: 'Strictly vetted partners ensuring ethical, high-quality plants.', icon: <ShieldCheck size={36} /> },
  { id: 2, title: 'Safe Delivery', description: 'Climate-controlled, secure transit straight to your doorstep.', icon: <Truck size={36} /> },
  { id: 3, title: 'Expert Support', description: '24/7 access to botanists ready to help your plants thrive.', icon: <Clock size={36} /> },
  { id: 4, title: 'Healthy Returns', description: 'Comprehensive 15-day policy for total peace of mind.', icon: <Heart size={36} /> }
];

const MOCK_TESTIMONIALS = [
  { id: 1, name: 'Sarah Jenkins', role: 'Plant Enthusiast', text: '"GreenShelf completely transformed my apartment. The Monstera arrived intact and is absolutely thriving!"' },
  { id: 2, name: 'David Chen', role: 'Beginner Gardener', text: '"I love how they connect me directly with local nurseries. The quality dwarfs big box store offerings."' },
  { id: 3, name: 'Amanda Smith', role: 'Interior Designer', text: '"My absolute go-to platform. Reliable, huge selection, and fantastic customer service every single time."' }
];

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export default function HomePage() {
  const navigate = useNavigate();
  const [featuredPlants, setFeaturedPlants] = useState(MOCK_PLANTS);
  const [topNurseries, setTopNurseries] = useState(MOCK_NURSERIES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch real data when backend is available
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('🌱 Fetching featured products from API...');
        const response = await productService.getFeaturedProducts(8);
        console.log('📦 API response:', response);
        
        // Check if response has data and it's an array
        if (response && response.data && Array.isArray(response.data)) {
          console.log('✅ Found', response.data.length, 'products in API response');
          
          // Transform API data to match HomePage structure
          const transformedPlants = response.data.map((plant, index) => {
            // Validate required fields
            if (!plant.id || !plant.name) {
              console.warn(`⚠️ Invalid plant data at index ${index}:`, plant);
              return null;
            }
            
            const transformedPlant = {
              id: plant.id,
              name: plant.name || 'Unknown Plant',
              price: plant.prize || 0, // This will be displayed as ₹ in the UI
              rating: plant.rating || 4.5, // Use API rating if available, otherwise default
              nursery: plant.nurseryName || plant.nursery?.name || 'Local Nursery',
              image: getImageUrl(plant.productImage || plant.image),
              badge: plant.prize > 1000 ? 'Premium' : plant.prize > 500 ? 'Popular' : 'Great Value'
            };
            
            console.log(`🌿 Transformed plant ${index + 1}:`, transformedPlant);
            return transformedPlant;
          }).filter(Boolean); // Remove any null entries from validation failures
          
          if (transformedPlants.length > 0) {
            setFeaturedPlants(transformedPlants);
            console.log('✅ Featured plants loaded successfully:', transformedPlants.length);
          } else {
            console.warn('⚠️ No valid plants found after transformation');
          }
        } else {
          console.warn('⚠️ Invalid API response structure:', response);
        }
      } catch (error) {
        console.error('❌ API Error in fetchData:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
        
        // Don't show error to user immediately, just log it
        // Mock data will serve as fallback
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 text-center rounded-b-[3rem] md:rounded-b-[5rem] overflow-hidden mb-16 md:mb-24">
        {/* Beautiful Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-nature-100 to-green-200"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent"></div>
        
        {/* Background Decorative Blur Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-nature-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-nature-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-4"
          initial="hidden"
          animate="show"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-nature-600/10 text-nature-700 px-4 py-2 rounded-full font-semibold text-sm md:text-base mb-6 md:mb-8 shadow-sm">
            <Sprout size={18} /> Welcome to the Modern Plant Marketplace
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold text-nature-900 leading-tight mb-6 tracking-tight">
            Bring Nature <br /> <span className="text-nature-600">Into Your Space</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect with top-rated local nurseries, explore thousands of beautiful plants, and build your dream indoor garden seamlessly with GreenShelf.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/products')}
              className="btn btn-primary w-full sm:w-auto"
            >
              Shop Now <ArrowRight size={20} className="ml-2" />
            </button>
            <button className="btn btn-secondary w-full sm:w-auto">
              Explore Nurseries
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <motion.section
        className="max-w-7xl mx-auto px-4 py-16"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.div variants={fadeUpVariants} className="text-center">
          <h2 className="section-title">Shop By Category</h2>
          <p className="section-subtitle">Find exactly what you're looking for with our curated plant collections tailored to your lifestyle.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_CATEGORIES.map((category) => (
            <motion.div key={category.id} variants={itemVariants} className="bg-white rounded-3xl p-8 text-center cursor-pointer shadow-sm border border-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${category.color}`}>
                {category.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-nature-600 transition-colors">{category.name}</h3>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 3. FEATURED PLANTS SECTION */}
      <motion.section
        className="max-w-7xl mx-auto px-4 py-16"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <motion.div variants={fadeUpVariants} className="text-left">
            <h2 className="section-title !mb-2 !text-left">Featured Plants</h2>
            <p className="text-gray-500 text-lg">Hand-picked favorites from our top nurseries</p>
          </motion.div>
          <motion.button variants={fadeUpVariants} className="text-nature-600 font-semibold hover:text-nature-800 flex items-center transition-colors">
            View All Plants <ArrowRight size={18} className="ml-1" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredPlants.map((plant) => (
            <motion.div key={plant.id} variants={itemVariants} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 group flex flex-col h-full cursor-pointer"
                 onClick={() => navigate(`/products/${plant.id}`)}>
              <div className="relative h-72 overflow-hidden bg-gray-100">
                {plant.badge && (
                  <span className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur text-nature-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                    {plant.badge}
                  </span>
                )}
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/300/200';
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-white/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                  <button className="btn btn-primary w-full py-2.5">
                    <ShoppingCart size={18} className="mr-2" /> Quick Add
                  </button>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{plant.name}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-4">
                  <Leaf size={14} className="text-nature-500" /> {plant.nursery}
                </p>
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-50">
                  <span className="text-2xl font-extrabold text-nature-600">₹{plant.price.toFixed(2)}</span>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 bg-gray-50 px-2 py-1 rounded-md">
                    <Star size={14} className="text-amber-400 fill-amber-400" /> {plant.rating}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 4. ECO IMPACT SECTION */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <motion.div
           className="max-w-7xl mx-auto bg-nature-50 rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 shadow-sm border border-nature-100"
           initial="hidden"
           whileInView="show"
           viewport={{ once: true, margin: "-100px" }}
           variants={fadeUpVariants}
        >
          <div className="flex-1 order-2 lg:order-1 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-extrabold text-nature-900 mb-6">Cultivating a Greener Tomorrow</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              At GreenShelf, we believe in sustainable e-commerce. For every plant purchased, we contribute to reforestation projects around the globe. Join us in making a real environmental impact.
            </p>
            <div className="space-y-6 text-left max-w-md mx-auto lg:mx-0">
              {[
                { text: 'Eco-friendly packaging for all orders', icon: <Sprout size={24} /> },
                { text: 'Locally sourced plants reduce transport emissions', icon: <Leaf size={24} /> },
                { text: '1% of all revenue goes to reforestation', icon: <Heart size={24} /> }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white text-nature-600 flex items-center justify-center rounded-full shadow-sm">
                    {item.icon}
                  </div>
                  <span className="text-lg font-semibold text-gray-800">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-center lg:justify-start">
              <button className="btn btn-primary bg-nature-700 hover:bg-nature-800">Learn More About Our Impact</button>
            </div>
          </div>
          <div className="flex-1 order-1 lg:order-2 w-full max-w-lg mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-nature-400 rounded-3xl rotate-3 scale-105 opacity-20"></div>
              <img
                src="https://images.unsplash.com/photo-1416879598555-220db7227bf3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Eco Impact"
                className="relative z-10 w-full h-auto rounded-3xl object-cover shadow-2xl"
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* 5. TOP NURSERIES */}
      <motion.section
        className="max-w-7xl mx-auto px-4 py-16"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.div variants={fadeUpVariants} className="text-center">
          <h2 className="section-title">Trusted Nurseries</h2>
          <p className="section-subtitle">Discover amazing local sellers committed to nurturing high-quality plants.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topNurseries.map((nursery) => (
            <motion.div key={nursery.id} variants={itemVariants} className="bg-white rounded-3xl p-8 flex items-center gap-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-nature-200 transition-all duration-300 cursor-pointer group">
              <div className="w-16 h-16 flex-shrink-0 bg-nature-100 rounded-2xl flex items-center justify-center text-nature-600 group-hover:scale-110 group-hover:bg-nature-600 group-hover:text-white transition-all duration-300">
                <Sprout size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{nursery.name}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-3 gap-1">
                  <MapPin size={14} className="text-nature-500" /> {nursery.location}
                </div>
                <div className="flex gap-3 text-sm font-semibold">
                  <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2 py-1 rounded-md">
                    <Star size={12} className="fill-amber-500" /> {nursery.rating}
                  </span>
                  <span className="flex items-center gap-1.5 bg-nature-50 text-nature-700 px-2 py-1 rounded-md">
                    <ShoppingCart size={12} /> {nursery.products}+ Items
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 6. WHY CHOOSE US */}
      <motion.section
         className="max-w-7xl mx-auto px-4 py-16 md:py-24"
         initial="hidden"
         whileInView="show"
         viewport={{ once: true, margin: "-100px" }}
         variants={containerVariants}
      >
        <motion.h2 variants={fadeUpVariants} className="section-title text-center">Why Choose GreenShelf</motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 md:mt-16">
          {MOCK_FEATURES.map((feature) => (
            <motion.div key={feature.id} variants={itemVariants} className="bg-white p-8 rounded-3xl text-center shadow-sm border border-gray-50 hover:shadow-xl transition-shadow duration-300 group">
              <div className="w-20 h-20 mx-auto bg-nature-50 text-nature-600 rounded-2xl flex items-center justify-center mb-6 -rotate-6 group-hover:rotate-0 group-hover:bg-nature-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 7. STATS SECTION */}
      <section className="relative bg-nature-900 py-24 my-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-nature-700/50 via-nature-900 to-black/80"></div>
        <motion.div
           className="relative z-10 max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center"
           initial="hidden"
           whileInView="show"
           viewport={{ once: true }}
           variants={containerVariants}
        >
          {[
            { label: 'Happy Customers', value: '15K+' },
            { label: 'Plants Delivered', value: '50K+' },
            { label: 'Verified Sellers', value: '120+' },
            { label: 'Trees Planted', value: '25K+' }
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants} className="flex flex-col items-center">
              <h3 className="text-4xl md:text-6xl font-black text-nature-400 mb-3">{stat.value}</h3>
              <p className="text-sm md:text-base uppercase tracking-widest font-semibold text-white/80">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 8. TESTIMONIALS */}
      <motion.section
         className="max-w-7xl mx-auto px-4 py-16"
         initial="hidden"
         whileInView="show"
         viewport={{ once: true, margin: "-100px" }}
         variants={containerVariants}
      >
        <motion.div variants={fadeUpVariants} className="text-center">
          <h2 className="section-title">Plant Lovers Community</h2>
          <p className="section-subtitle">Hear what our amazing community has to say about their GreenShelf experience.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_TESTIMONIALS.map((testimonial) => (
            <motion.div key={testimonial.id} variants={itemVariants} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full relative">
              <div className="absolute top-8 right-8 text-nature-100 text-6xl font-serif">"</div>
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-nature-300 to-nature-600 flex justify-center items-center text-white font-bold text-xl shadow-md">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <span className="text-sm text-nature-600 font-medium">{testimonial.role}</span>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed flex-grow relative z-10 mb-6">{testimonial.text}</p>
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-current" />)}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 9. NEWSLETTER / CTA */}
      <motion.section
         className="max-w-5xl mx-auto px-4 py-16 md:py-24"
         initial="hidden"
         whileInView="show"
         viewport={{ once: true, margin: "-50px" }}
         variants={fadeUpVariants}
      >
        <div className="relative bg-gradient-to-br from-nature-800 to-nature-950 rounded-[3rem] p-10 md:p-16 text-center shadow-2xl overflow-hidden">
          {/* Abstract circles */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-nature-500/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Join Our Plant Community</h2>
            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive nursery offers, plant care tips, and environmental impact updates!
            </p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address..."
                className="flex-1 px-6 py-4 rounded-full outline-none text-gray-900 focus:ring-4 focus:ring-nature-500/50 shadow-inner"
                required
              />
              <button type="submit" className="btn btn-primary bg-nature-500 hover:bg-nature-400 border border-transparent whitespace-nowrap shadow-xl shadow-nature-900/50">
                Subscribe <Send size={18} className="ml-2" />
              </button>
            </form>
          </div>
        </div>
      </motion.section>

      {/* 10. FOOTER */}
      <footer className="bg-gray-900 text-gray-300 pt-20 pb-10 border-t-4 border-nature-600">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16 text-center md:text-left">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-extrabold text-white flex items-center justify-center md:justify-start gap-2 mb-6">
              <Sprout size={36} className="text-nature-500" /> GreenShelf
            </h2>
            <p className="text-gray-400 leading-relaxed max-w-sm mx-auto md:mx-0 mb-8">
              Your ultimate marketplace for all things green. Uniting trusted local nurseries and passionate plant enthusiasts in one beautiful platform.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-nature-600 hover:text-white transition-colors duration-300"><FaInstagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-nature-600 hover:text-white transition-colors duration-300"><FaTwitter size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-nature-600 hover:text-white transition-colors duration-300"><FaFacebook size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">Shop</h4>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-nature-400 transition-colors">Indoor Plants</a></li>
              <li><a href="#" className="hover:text-nature-400 transition-colors">Outdoor Plants</a></li>
              <li><a href="#" className="hover:text-nature-400 transition-colors">Succulents & Cacti</a></li>
              <li><a href="#" className="hover:text-nature-400 transition-colors">Plant Care Tools</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-nature-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-nature-400 transition-colors">Nurseries Directory</a></li>
              <li><a href="#" className="hover:text-nature-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-nature-400 transition-colors">Eco Impact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">Support</h4>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-nature-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-nature-400 transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-nature-400 transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-nature-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} GreenShelf Inc. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}