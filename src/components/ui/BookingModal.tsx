import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  designerId: string;
  designerName: string;
  projectTitle?: string;
  type: "consultation" | "similar-design";
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  designerId,
  designerName,
  projectTitle,
  type,
}) => {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: "",
    preferredDate: "",
    preferredTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://marahib-dashboard.vercel.app";

  // Check for user authentication and pre-populate form
  useEffect(() => {
    const checkAuthAndPopulate = async () => {
      if (!isOpen) return;

      console.log('📋 BookingModal: Checking authentication and pre-filling form...');

      try {
        // Get token from localStorage
        const accessToken = localStorage.getItem('access_token');
        console.log('🔑 BookingModal: Token found:', !!accessToken);

        if (!accessToken) {
          console.log('❌ BookingModal: No token found, user not authenticated');
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        // First, try to get user data from localStorage (faster)
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          console.log('👤 BookingModal: Found stored user data');
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAuthenticated(true);
            
            // Pre-populate form with stored user data
            const firstName = userData.firstName || 
                            userData.first_name || 
                            userData.user_metadata?.first_name || '';
            const lastName = userData.lastName || 
                           userData.last_name || 
                           userData.user_metadata?.last_name || '';
            const phone = userData.phone || 
                         userData.user_metadata?.phone || '';

            console.log('✅ BookingModal: Pre-filling form with:', {
              firstName,
              lastName,
              email: userData.email,
              phone
            });

            setFormData(prev => ({
              ...prev,
              firstName,
              lastName,
              email: userData.email || '',
              phone,
            }));

            return; // Exit early since we have the data
          } catch (parseError) {
            console.error('❌ BookingModal: Error parsing stored user data:', parseError);
          }
        }

        // If no stored user data, fetch from API
        console.log('🌐 BookingModal: Fetching user data from API...');
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('📡 BookingModal: API response status:', response.status);

        if (response.ok) {
          const result = await response.json();
          console.log('📦 BookingModal: API response:', result);

          // Handle the correct API response format: { success: true, user: userData }
          if (result.success && result.user) {
            const userData = result.user;
            setUser(userData);
            setIsAuthenticated(true);
            
            // Pre-populate form with API user data
            const firstName = userData.firstName || 
                            userData.first_name || 
                            userData.user_metadata?.first_name || '';
            const lastName = userData.lastName || 
                           userData.last_name || 
                           userData.user_metadata?.last_name || '';
            const phone = userData.phone || 
                         userData.user_metadata?.phone || '';

            console.log('✅ BookingModal: Pre-filling form from API with:', {
              firstName,
              lastName,
              email: userData.email,
              phone
            });

            setFormData(prev => ({
              ...prev,
              firstName,
              lastName,
              email: userData.email || '',
              phone,
            }));

            // Also update localStorage for future use
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            console.log('❌ BookingModal: API response format unexpected:', result);
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          console.log('❌ BookingModal: API call failed, token might be expired');
          setIsAuthenticated(false);
          setUser(null);
          // Optionally clear invalid token
          // localStorage.removeItem('access_token');
          // localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('💥 BookingModal: Error checking authentication:', error);
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuthAndPopulate();
  }, [isOpen, API_BASE_URL]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submissionData = {
        // Form data
        ...formData,
        
        // Designer information
        designer_id: designerId,
        designerName,
        projectTitle,
        
        // User context
        userId: user?.id || null,
        isAuthenticated,
        
        // System data
        submittedAt: new Date().toISOString(),
        status: 'pending',
      };

      console.log('📤 BookingModal: Submitting consultation data:', submissionData);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Add authorization header if user is authenticated
      if (isAuthenticated) {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/consultations`, {
        method: "POST",
        headers,
        body: JSON.stringify(submissionData),
      });

      console.log('📡 BookingModal: Submission response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ BookingModal: Submission failed:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ BookingModal: Submission result:', result);
      
      // Handle different possible success response formats
      const isSuccess = result.success === true || 
                       result.result === 'success' || 
                       response.status === 200;

      if (!isSuccess) {
        throw new Error(result.message || result.error || 'Failed to submit consultation');
      }

      console.log("✅ BookingModal: Consultation submitted successfully");
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setStep(1);
        // Reset form but keep user info if authenticated
        if (isAuthenticated && user) {
          const firstName = user.firstName || 
                          user.first_name || 
                          user.user_metadata?.first_name || '';
          const lastName = user.lastName || 
                         user.last_name || 
                         user.user_metadata?.last_name || '';
          const phone = user.phone || 
                       user.user_metadata?.phone || '';
          
          setFormData({
            firstName,
            lastName,
            email: user.email || '',
            phone,
            projectType: "",
            budget: "",
            timeline: "",
            message: "",
            preferredDate: "",
            preferredTime: "",
          });
        } else {
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            projectType: "",
            budget: "",
            timeline: "",
            message: "",
            preferredDate: "",
            preferredTime: "",
          });
        }
        onClose();
      }, 3000);
    } catch (error) {
      console.error("💥 BookingModal: Error submitting consultation:", error);
      setIsSubmitting(false);
      alert(
        "Sorry, there was an error submitting your consultation request. Please try again."
      );
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email;
      case 2:
        return formData.projectType && formData.budget && formData.timeline;
      case 3:
        return formData.preferredDate && formData.preferredTime;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {isSubmitted ? (
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="font-serif text-2xl text-gray-900 mb-4">
                Consultation Request Submitted!
              </h3>
              <p className="text-gray-600 mb-2">
                Thank you for your interest in working with {designerName}.
              </p>
              <p className="text-gray-600">
                Our team will review your request and contact you within 24 hours to confirm your consultation details.
              </p>
              {isAuthenticated && (
                <p className="text-sm text-gray-500 mt-4">
                  You can track your consultation status in your dashboard.
                </p>
              )}
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="font-serif text-xl text-gray-900">
                    {type === "consultation"
                      ? "Book Consultation"
                      : "Request Similar Design"}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    with {designerName}
                    {projectTitle && ` • ${projectTitle}`}
                  </p>
                  {isAuthenticated && user && (
                    <p className="text-xs text-green-600 mt-1 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Signed in as {user.firstName || user.first_name || user.email?.split('@')[0]}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((stepNumber) => (
                    <div key={stepNumber} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          step >= stepNumber
                            ? "bg-black text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {stepNumber}
                      </div>
                      <span
                        className={`ml-2 text-sm ${
                          step >= stepNumber ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {stepNumber === 1
                          ? "Contact"
                          : stepNumber === 2
                          ? "Project"
                          : "Schedule"}
                      </span>
                      {stepNumber < 3 && (
                        <div
                          className={`w-12 h-0.5 mx-4 ${
                            step > stepNumber ? "bg-black" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="p-6">
                  {/* Step 1: Contact Information */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <h3 className="font-medium text-gray-900 mb-4">
                        Contact Information
                        {isAuthenticated && (
                          <span className="text-sm font-normal text-green-600 ml-2">
                            (Pre-filled from your account)
                          </span>
                        )}
                      </h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+971 50 123 4567"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Project Details */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <h3 className="font-medium text-gray-900 mb-4">
                        Project Details
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project Type *
                        </label>
                        <select
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                        >
                          <option value="">Select project type</option>
                          <option value="residential">
                            Residential Interior
                          </option>
                          <option value="commercial">Commercial Space</option>
                          <option value="custom-furniture">
                            Custom Furniture
                          </option>
                          <option value="consultation">
                            Design Consultation
                          </option>
                          <option value="renovation">Renovation Project</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Budget Range *
                        </label>
                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                        >
                          <option value="">Select budget range</option>
                          <option value="10k-25k">AED 10,000 - 25,000</option>
                          <option value="25k-50k">AED 25,000 - 50,000</option>
                          <option value="50k-100k">AED 50,000 - 100,000</option>
                          <option value="100k-250k">AED 100,000 - 250,000</option>
                          <option value="250k+">AED 250,000+</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timeline *
                        </label>
                        <select
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                        >
                          <option value="">Select timeline</option>
                          <option value="asap">As soon as possible</option>
                          <option value="1-3months">1-3 months</option>
                          <option value="3-6months">3-6 months</option>
                          <option value="6-12months">6-12 months</option>
                          <option value="flexible">Flexible</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project Description
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Tell us about your project, style preferences, and any specific requirements..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Schedule */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <h3 className="font-medium text-gray-900 mb-4">
                        Schedule Consultation
                      </h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preferred Date *
                          </label>
                          <input
                            type="date"
                            name="preferredDate"
                            value={formData.preferredDate}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split("T")[0]}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preferred Time *
                          </label>
                          <select
                            name="preferredTime"
                            value={formData.preferredTime}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                          >
                            <option value="">Select time</option>
                            <option value="09:00">9:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="15:00">3:00 PM</option>
                            <option value="16:00">4:00 PM</option>
                            <option value="17:00">5:00 PM</option>
                          </select>
                        </div>
                      </div>

                      <div className="bg-stone-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">
                          What to Expect
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• 60-minute consultation session</li>
                          <li>• Discussion of your project requirements</li>
                          <li>• Initial design concepts and recommendations</li>
                          <li>• Project timeline and budget planning</li>
                          <li>• Next steps and proposal outline</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium rounded-md"
                      >
                        Previous
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    {step < 3 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!isStepValid()}
                        className="px-6 py-2 bg-black text-white hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium rounded-md"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={!isStepValid() || isSubmitting}
                        className="px-6 py-2 bg-black text-white hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center rounded-md"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Request"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;