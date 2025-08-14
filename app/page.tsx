'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Users, Star, Sparkles, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Tour interface matching your API data structure
interface Tour {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  discountedPrice?: number;
  duration: number;
  location: string;
  category: {
    _id: string;
    name: string;
  };
  difficulty: string;
  images: string[];
  highlights: string[];
  isFeatured: boolean;
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const carouselImages = [
    {
      src: 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=1200',
      title: t('home.hero.title1'),
      description: t('home.hero.desc1')
    },
    {
      src: 'https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg?auto=compress&cs=tinysrgb&w=1200',
      title: t('home.hero.title2'),
      description: t('home.hero.desc2')
    },
    {
      src: 'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=1200',
      title: t('home.hero.title3'),
      description: t('home.hero.desc3')
    }
  ];

  // Fetch featured tours from API
  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tour-packages?populate=true&isActive=true&isFeatured=true&limit=3');
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured tours');
        }
        
        const data = await response.json();
        setFeaturedTours(data.tourPackages || []);
      } catch (error) {
        console.error('Error fetching featured tours:', error);
        // Fallback to empty array or demo data if needed
        setFeaturedTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTours();
  }, []);

  // Helper function to get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'challenging':
      case 'hard': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'extreme': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0, rotateY: -45 },
    visible: {
      scale: 1,
      opacity: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15
      }
    },
    hover: {
      scale: 1.05,
      rotateY: 10,
      rotateX: 5,
      z: 50,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const floatingVariants = {
    floating: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const slideVariants = {
    enter: {
      x: 1000,
      opacity: 0,
      scale: 0.8
    },
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    },
    exit: {
      x: -1000,
      opacity: 0,
      scale: 0.8,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <motion.div 
      className="min-h-screen overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-gradient { 
          background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c);
          background-size: 400% 400%;
          animation: gradient-shift 4s ease infinite;
        }
        .shimmer-effect {
          position: relative;
          overflow: hidden;
        }
        .shimmer-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transform: translateX(-100%);
          animation: shimmer 2s infinite;
        }
        .glass-effect {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>

      {/* Hero Carousel */}
      <motion.section className="relative h-[70vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            variants={slideVariants as any}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <div
              className="h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${carouselImages[currentSlide].src})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-purple-900/30 to-blue-900/50" />
              
              {/* Floating particles effect */}
              <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    variants={floatingVariants as any}
                    animate="floating"
                    transition={{
                      delay: i * 0.5,
                      duration: 3 + Math.random() * 2
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-white/30" />
                  </motion.div>
                ))}
              </div>

              <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                <motion.div 
                  className="max-w-4xl px-4"
                  variants={itemVariants as any}
                >
                  <motion.h1 
                    className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                  >
                    {carouselImages[currentSlide].title}
                  </motion.h1>
                  <motion.p 
                    className="text-xl md:text-2xl mb-8 text-white/90"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    {carouselImages[currentSlide].description}
                  </motion.p>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                  >
                    <Button 
                      asChild 
                      size="lg" 
                      className="animate-pulse-glow bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3 rounded-full border-0 shadow-2xl"
                    >
                      <Link href="/tours" className="inline-flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Zap className="h-5 w-5" />
                        </motion.div>
                        {t('home.hero.explore')}
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <motion.button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 glass-effect hover:bg-white/20 text-white p-3 rounded-full group"
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <ChevronLeft className="h-6 w-6" />
        </motion.button>
        <motion.button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 glass-effect hover:bg-white/20 text-white p-3 rounded-full group"
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <ChevronRight className="h-6 w-6" />
        </motion.button>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide 
                  ? 'bg-white shadow-lg' 
                  : 'bg-white/50'
              }`}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              animate={{ 
                scale: index === currentSlide ? 1.25 : 1,
                opacity: index === currentSlide ? 1 : 0.7
              }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          ))}
        </div>
      </motion.section>

      {/* Featured Tours */}
      <motion.section 
        className="py-16 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <motion.div 
            className="absolute top-10 left-10 w-32 h-32 rounded-full animate-gradient"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute top-40 right-20 w-24 h-24 rounded-full bg-purple-300"
            variants={floatingVariants as any}
            animate="floating"
          />
          <motion.div 
            className="absolute bottom-20 left-1/3 w-20 h-20 rounded-full bg-blue-300"
            variants={floatingVariants as any}
            animate="floating"
            transition={{ delay: 1 }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div className="text-center mb-12" variants={itemVariants as any}>
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            >
              {t('home.featured.title') || 'Featured Tours'}
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              {t('home.featured.subtitle') || 'Discover our handpicked premium experiences'}
            </motion.p>
          </motion.div>
          
          {loading ? (
            // Loading skeleton
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredTours.length > 0 ? (
            <motion.div 
              className="grid md:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {featuredTours.map((tour, index) => (
                <motion.div
                  key={tour._id}
                  variants={cardVariants as any}
                  whileHover="hover"
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-2xl border-0 bg-white/80 backdrop-blur-sm h-full">
                    <motion.div className="relative h-48 shimmer-effect group">
                      <motion.img
                        src={tour.images[0] || '/placeholder.png'}
                        alt={tour.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Category Badge */}
                      <Badge className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700 shadow-lg">
                        {tour.category?.name || 'Uncategorized'}
                      </Badge>
                      
                      {/* Price */}
                      <motion.div 
                        className="absolute top-4 right-4 glass-effect px-3 py-2 rounded-full text-sm font-bold text-white shadow-lg"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                      >
                        {tour.discountedPrice && tour.discountedPrice > 0 && tour.discountedPrice < tour.price ? (
                          <div className="text-center">
                            <div className="text-xs line-through opacity-75">¥{tour.price.toLocaleString()}</div>
                            <div className="text-sm font-bold text-yellow-300">¥{tour.discountedPrice.toLocaleString()}</div>
                          </div>
                        ) : (
                          `¥${tour.price.toLocaleString()}`
                        )}
                      </motion.div>
                      
                      <motion.div 
                        className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100"
                        initial={{ y: 20 }}
                        whileHover={{ y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="text-white text-sm font-medium">Featured Tour</div>
                      </motion.div>
                    </motion.div>
                    
                    <CardContent className="p-6 relative">
                      <motion.h3 
                        className="text-xl font-bold mb-2 text-gray-900 line-clamp-1"
                        whileHover={{ color: "#2563eb" }}
                      >
                        {tour.name}
                      </motion.h3>
                      
                      {/* Location and Duration */}
                      <div className="flex items-center gap-4 text-gray-600 mb-3">
                        <motion.div 
                          className="flex items-center"
                          whileHover={{ color: "#3b82f6", x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{tour.location}</span>
                        </motion.div>
                        <motion.div 
                          className="flex items-center"
                          whileHover={{ color: "#10b981", x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-sm">{tour.duration} {tour.duration === 1 ? 'Day' : 'Days'}</span>
                        </motion.div>
                      </div>
                      
                      {/* Difficulty Badge */}
                      <div className="mb-3">
                        <Badge 
                          variant="outline" 
                          className={`text-xs font-medium ${getDifficultyColor(tour.difficulty)}`}
                        >
                          {tour.difficulty}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {tour.shortDescription || tour.description}
                      </p>
                      
                      {/* Highlights */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {tour.highlights.slice(0, 2).map((highlight, highlightIndex) => (
                          <Badge 
                            key={highlightIndex} 
                            variant="secondary" 
                            className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                          >
                            {highlight}
                          </Badge>
                        ))}
                        {tour.highlights.length > 2 && (
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                            +{tour.highlights.length - 2} more
                          </Badge>
                        )}
                      </div>
                      
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          asChild 
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-lg hover:shadow-xl"
                        >
                          <Link href={`/tours/${tour._id}`} className="inline-flex items-center justify-center gap-2">
                            {t('tours.viewDetails') || 'View Details'}
                            <motion.div
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </motion.div>
                          </Link>
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // No featured tours message
            <motion.div 
              className="text-center py-12"
              variants={itemVariants as any}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 max-w-md mx-auto">
                <Sparkles className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Featured Tours Yet</h3>
                <p className="text-gray-600 mb-6">
                  We're curating amazing experiences for you. Check back soon!
                </p>
                <Button 
                  asChild 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Link href="/tours">Browse All Tours</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Company Description */}
      <motion.section 
        className="py-16 relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-blue-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants as any}>
              <motion.h2 
                className="text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent"
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                {t('home.company.title')}
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-600 mb-6"
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                {t('home.company.desc')}
              </motion.p>
              <div className="space-y-6">
                {[
                  { 
                    icon: Users, 
                    title: t("home.features.expertGuides"), 
                    desc: t("home.features.expertGuidesDesc") 
                  },
                  { 
                    icon: Star, 
                    title: t("home.features.premiumQuality"), 
                    desc: t("home.features.premiumQualityDesc") 
                  },
                  { 
                    icon: MapPin, 
                    title: t("home.features.uniqueDestinations"), 
                    desc: t("home.features.uniqueDestinationsDesc") 
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start group"
                    initial={{ x: -50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ x: 10 }}
                  >
                    <motion.div 
                      className="glass-effect p-2 rounded-full mr-4"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <item.icon className="h-6 w-6 text-blue-600" />
                    </motion.div>
                    <div>
                      <motion.h3 
                        className="font-semibold text-gray-900"
                        whileHover={{ color: "#2563eb" }}
                      >
                        {item.title}
                      </motion.h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              className="relative"
              variants={itemVariants as any}
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src="https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Travel group"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Floating elements */}
                <motion.div 
                  className="absolute -top-4 -right-4 glass-effect p-3 rounded-full"
                  variants={floatingVariants as any}
                  animate="floating"
                  whileHover={{ scale: 1.2 }}
                >
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </motion.div>
                <motion.div 
                  className="absolute -bottom-4 -left-4 glass-effect p-3 rounded-full"
                  variants={floatingVariants as any}
                  animate="floating"
                  transition={{ delay: 1 }}
                  whileHover={{ scale: 1.2 }}
                >
                  <Zap className="h-6 w-6 text-purple-600" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section 
        className="py-16 relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 animate-gradient"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              variants={floatingVariants as any}
              animate="floating"
              transition={{
                delay: i * 0.7,
                duration: 4 + Math.random() * 3
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center px-4 relative z-10 text-white">
          <motion.h2 
            className="text-4xl font-bold mb-6"
            variants={itemVariants as any}
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            {t('home.cta.title')}
          </motion.h2>
          <motion.p 
            className="text-xl mb-8"
            variants={itemVariants as any}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {t('home.cta.subtitle')}
          </motion.p>
          <motion.div 
            className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants as any}
            >
              <Button 
                asChild 
                size="lg" 
                className="glass-effect hover:bg-white/20 text-white border-white/30 rounded-full px-8 py-3 shadow-2xl"
              >
                <Link href="/tours" className="inline-flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-5 w-5" />
                  </motion.div>
                  {t('home.cta.browse')}
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants as any}
            >
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-8 py-3 shadow-2xl"
              >
                <Link href="/about" className="inline-flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t('home.cta.learn')}
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
}