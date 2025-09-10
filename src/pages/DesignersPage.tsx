import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ExternalLink, MapPin, Award, Calendar } from "lucide-react";

export interface Designer {
  id: string;
  user_id: string;
  display_name: string;
  bio: string;
  commission_rate: number;
  status: string;
  years_experience: number;
  rating: number;
  total_reviews: number;
  created_at: string;
  total_portfolios?: number;
  total_consultations?: number;
  total_earnings?: number;
  total_looks?: number;
  specialties?: string[];
  profile_image_url?: string;
  address?: string;
  location?: string;
}

// Skeleton component for loading state
const DesignerSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-sm">
    <div className="relative aspect-square overflow-hidden">
      <div className="w-full h-full bg-gray-200 animate-pulse" />
    </div>
    <div className="p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-3/4" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20" />
        <div className="h-6 bg-gray-200 rounded-full animate-pulse w-24" />
      </div>

      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
        <div className="flex items-center space-x-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
        </div>
      </div>
    </div>
  </div>
);

const DesignersPage: React.FC = () => {
  const [designers, setDesigners] = React.useState<Designer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDesigners = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/website/designers`,
          {
            method: "GET",
            mode: "cors", 
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch designers");
        }

        const designers = await response.json();
        setDesigners(designers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching designers:", error);
        setLoading(false);
      }
    };
    fetchDesigners();
  }, []);

  return (
    <div className="py-12 bg-gray-50">
      <div className="container-custom">
        {/* Header section - always visible and not affected by loading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-serif text-4xl md:text-5xl mb-4">
            Our Designers
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet the visionary designers behind our exceptional furniture
            collections, each bringing their unique perspective and expertise to
            create pieces that inspire.
          </p>
        </motion.div>

        {/* Designers grid - shows skeleton while loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? // Show skeleton cards while loading
              Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <DesignerSkeleton />
                </motion.div>
              ))
            : // Show actual designer cards when loaded
              designers?.map((designer, index) => (
                <motion.div
                  key={designer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
                >
                  <Link to={`/designers/${designer.id}`} className="block">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={designer.profile_image_url}
                        alt={designer.display_name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-serif text-xl text-gray-900 mb-1 group-hover:text-black transition-colors">
                            {designer.display_name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <MapPin className="w-3 h-3 mr-1" />
                            {designer.location}
                          </div>
                        </div>
                        <ExternalLink
                          size={16}
                          className="text-gray-400 group-hover:text-gray-600 transition-colors"
                        />
                      </div>

                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        {designer.bio}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {designer.specialties?.map((specialty, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>Est. {designer.years_experience}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span>{designer.total_portfolios} Products</span>
                          <div className="flex items-center">
                            <Award className="w-3 h-3 mr-1" />
                            <span>{designer.rating} Rating</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>

        {/* Call to Action - always visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center bg-white p-12 rounded-lg shadow-sm"
        >
          <h2 className="font-serif text-2xl md:text-3xl text-gray-900 mb-4">
            Interested in Custom Design?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our designers are available for custom furniture commissions and
            interior design consultations. Create unique pieces tailored to your
            space and style.
          </p>
          <button className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-900 transition-colors uppercase tracking-wide">
            Request Consultation
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default DesignersPage;
