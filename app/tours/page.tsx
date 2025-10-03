"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, MapPin, Calendar, Star, Heart, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

// --- 1. UPDATE THE TOUR INTERFACE TO MATCH YOUR API DATA ---
interface Tour {
  _id: string; // Changed from id: number
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  duration: number; // Changed from string
  location: string;
  category: {
    // Category is now an object
    _id: string;
    name: string;
  };
  difficulty: string;
  images: string[]; // Changed from image: string
  highlights: string[];
  discountedPrice? : number;
}

interface Category {
  _id: string;
  name: string;
}

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [likedTours, setLikedTours] = useState<Set<string>>(new Set());
  const { addItem } = useCart();
  const { t } = useLanguage();

  // --- 2. FETCH REAL TOURS AND CATEGORIES ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch tours and categories in parallel
        const [toursResponse, categoriesResponse] = await Promise.all([
          fetch("/api/tour-packages?populate=true&isActive=true"),
          fetch("/api/categories?isActive=true"),
        ]);

        if (!toursResponse.ok || !categoriesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const toursData = await toursResponse.json();
        const categoriesData = await categoriesResponse.json();

        setTours(toursData.tourPackages || []);
        setFilteredTours(toursData.tourPackages || []); // Initially show all tours
        setCategories(categoriesData.categories || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load tour data. Please try again later.");
        // You could keep the demo data as a fallback here if you want
        setTours([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Run only once on component mount

  // --- 3. UPDATE FILTERING LOGIC ---
  useEffect(() => {
    let filtered = tours;

    // Filter by search term
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (tour) =>
          tour.name.toLowerCase().includes(lowercasedTerm) ||
          tour.location.toLowerCase().includes(lowercasedTerm) ||
          (tour.shortDescription &&
            tour.shortDescription.toLowerCase().includes(lowercasedTerm))
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (tour) => tour.category?._id === selectedCategory
      );
    }

    setFilteredTours(filtered);
  }, [searchTerm, selectedCategory, tours]);

  const handleAddToCart = (tour: Tour) => {
    addItem({
      id: tour._id as any,
      name: tour.name,
      price: tour.price,
      // Use the first image from the images array
      image: tour.images[0] || "/placeholder.png",
    });
    toast.success(`${tour.name} ${t("tours.addToCart")}!`);
  };

  const toggleLike = (tourId: string) => {
    setLikedTours(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(tourId)) {
        newLiked.delete(tourId);
      } else {
        newLiked.add(tourId);
      }
      return newLiked;
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="h-10 bg-gray-200 rounded-lg"></div>
                <div className="h-10 bg-gray-200 rounded-lg"></div>
                <div className="h-10 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-xl h-96 shadow-sm"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

return (
      <>
      {/* ADD THE STYLE TAG HERE - RIGHT AFTER THE OPENING <> */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Orbitron', sans-serif !important;
        }
        
        .glowetsu-font {
          font-family: 'Orbitron', sans-serif;
          letter-spacing: 0.3em;
          font-weight: 700;
        }
        
        h1, h2, h3, h4, h5, h6 {
          letter-spacing: 0.2em;
        }
        
        p, span, div {
          letter-spacing: 0.05em;
        }
        
        button {
          letter-spacing: 0.15em;
        }
      `}</style>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Discover Amazing Tours
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explore breathtaking destinations and create unforgettable memories with our curated travel experiences
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-black/80 backdrop-blur-sm border border-gray-600/30 rounded-xl shadow-xl p-6 mb-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-hover:text-orange-500 transition-colors" />
              <Input
                placeholder={t("tours.search") || "Search tours, locations..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-12 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="h-12 bg-gray-800 border-gray-600 text-white focus:ring-2 focus:ring-orange-500">
                <Filter className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white hover:bg-gray-700">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id} className="text-white hover:bg-gray-700">
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center justify-between text-sm text-gray-300 px-4 py-3 bg-gray-800 rounded-lg border border-gray-600">
              <span className="font-medium">{filteredTours.length} tours found</span>
              <Users className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Tours Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {filteredTours.map((tour, index) => (
            <Card
              key={tour._id}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col bg-black/40 backdrop-blur-md border border-gray-600/30 shadow-lg animate-in fade-in-0 slide-in-from-bottom-4 hover:border-orange-300/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={
                    tour.images[0] ||
                    "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt={tour.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Category Badge */}
                <Badge className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-orange-300 border border-orange-300/30 shadow-lg">
                  {tour.category?.name || "Uncategorized"}
                </Badge>
                
                {/* Price */}
                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                  {tour.discountedPrice && tour.discountedPrice > 0 && tour.discountedPrice < tour.price ? (
                    <div className="text-right">
                      <div className="text-xs text-gray-400 line-through leading-none">
                        ¥{tour.price.toLocaleString()}
                      </div>
                      <div className="text-lg font-bold text-orange-300 leading-none">
                        ¥{tour.discountedPrice.toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-white">
                      ¥{tour.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              
              <CardContent className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-orange-300 transition-colors line-clamp-1">
                  {tour.name}
                </h3>
                
                {/* Location and Duration */}
                <div className="flex items-center gap-4 text-gray-400 mb-3">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-orange-500" />
                    <span className="text-sm font-medium">{tour.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-emerald-500" />
                    <span className="text-sm font-medium">
                      {tour.duration} {tour.duration === 1 ? "Day" : "Days"}
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">
                  {tour.shortDescription || tour.description}
                </p>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {tour.highlights.slice(0, 3).map((highlight, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors"
                    >
                      {highlight}
                    </Badge>
                  ))}
                  {tour.highlights.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-400">
                      +{tour.highlights.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto">
                  <Button 
                    asChild 
                    variant="outline" 
                    className="w-full px-5 py-2.5 bg-orange-600 text-white hover:bg-orange-700 rounded-md transition-all duration-200 font-medium"
                  >
                    <Link href={`/tours/${tour._id}`}>
                      {t("tours.viewDetails") || "View Details"}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results Message */}
        {filteredTours.length === 0 && !loading && (
          <div className="text-center py-16 animate-in fade-in-0 duration-500">
            <div className="bg-black/40 backdrop-blur-md border border-gray-600/30 rounded-xl shadow-lg p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No tours found</h3>
              <p className="text-gray-300 mb-6">
                Try adjusting your search criteria or browse all available tours.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}