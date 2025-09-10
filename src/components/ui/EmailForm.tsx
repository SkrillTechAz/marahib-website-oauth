import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface EmailFormProps {
  onSuccess?: () => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !validateEmail(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (!consent) {
      setStatus('error');
      setErrorMessage('Please agree to receive marketing communications');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');

    try {
      const { error } = await supabase
        .from('email_subscribers')
        .insert([
          {
            email: email.toLowerCase().trim(),
            source: 'launch_landing_page',
            consent_given: consent,
          }
        ]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          setStatus('error');
          setErrorMessage('This email is already subscribed!');
        } else {
          throw error;
        }
      } else {

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            toEmail: 'abdelazizbiad1@gmail.com',
            toName: 'abdel',
            templateParams: { PRENOM: 'aziz', link: 'https://example.com/welcome' }
          })
        });

        const data = await res.json();
        console.log('Email send result:', data);
        setStatus('success');
        setEmail('');
        setConsent(false);
        onSuccess?.();
      }
    } catch (error) {
      console.error('Error subscribing email:', error);
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm border border-green-200/50 rounded-xl p-8 text-center shadow-lg"
      >
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6 animate-pulse" />
        <h3 className="text-xl font-medium text-green-800 mb-3">
          Thank you for subscribing!
        </h3>
        <p className="text-green-700 text-lg">
          You'll be the first to know when we launch on July 16th, 2025.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative">
        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-500 w-5 h-5 z-10" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-stone-200/50 rounded-xl focus:ring-2 focus:ring-stone-400 focus:border-stone-400 text-stone-800 placeholder-stone-500 text-lg shadow-lg transition-all duration-300 focus:bg-white/90"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex items-start space-x-4 p-4 beige-accent backdrop-blur-sm rounded-xl border border-stone-200/50">
        <input
          type="checkbox"
          id="consent"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 w-5 h-5 text-stone-600 bg-white/80 border-stone-300/50 rounded focus:ring-stone-400 focus:ring-2 transition-all duration-300"
          disabled={isSubmitting}
        />
        <label htmlFor="consent" className="text-stone-600 leading-relaxed text-base">
          I agree to receive marketing communications from Marahb. You can unsubscribe at any time.
          View our <a href="/privacy-policy" className="text-stone-800 font-medium hover:underline transition-all duration-300">Privacy Policy</a>.
        </label>
      </div>

      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-3 text-red-700 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-4"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-base">{errorMessage}</span>
        </motion.div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-stone-700 to-stone-800 hover:from-stone-800 hover:to-stone-900 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:hover:scale-100 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="relative z-10">
          {isSubmitting ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Get Noticed when launched'
          )}
        </span>
      </button>
    </form>
  );
};

export default EmailForm;