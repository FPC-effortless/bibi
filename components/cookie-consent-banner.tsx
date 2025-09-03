'use client';

import React, { useState, useEffect } from 'react';
import { X, Settings, Shield, BarChart3, Target, Palette } from 'lucide-react';
import { CookieConsent, recordUserConsent } from '@/lib/legal-compliance';

interface CookieConsentBannerProps {
  onConsentChange?: (consent: CookieConsent) => void;
}

interface CookieCategory {
  id: 'necessary' | 'analytics' | 'marketing' | 'preferences';
  name: string;
  description: string;
  icon: React.ReactNode;
  required: boolean;
  examples: string[];
}

const cookieCategories: CookieCategory[] = [
  {
    id: 'necessary',
    name: 'Necessary Cookies',
    description: 'Essential for the website to function properly. These cannot be disabled.',
    icon: <Shield className="w-5 h-5" />,
    required: true,
    examples: ['Authentication', 'Shopping cart', 'Security', 'Basic functionality'],
  },
  {
    id: 'analytics',
    name: 'Analytics Cookies',
    description: 'Help us understand how visitors interact with our website.',
    icon: <BarChart3 className="w-5 h-5" />,
    required: false,
    examples: ['Page views', 'User behavior', 'Performance metrics', 'Error tracking'],
  },
  {
    id: 'marketing',
    name: 'Marketing Cookies',
    description: 'Used to deliver personalized advertisements and track campaign effectiveness.',
    icon: <Target className="w-5 h-5" />,
    required: false,
    examples: ['Ad targeting', 'Campaign tracking', 'Social media integration', 'Retargeting'],
  },
  {
    id: 'preferences',
    name: 'Preference Cookies',
    description: 'Remember your settings and preferences for a better experience.',
    icon: <Palette className="w-5 h-5" />,
    required: false,
    examples: ['Language settings', 'Currency preferences', 'Theme choices', 'Layout preferences'],
  },
];

export default function CookieConsentBanner({ onConsentChange }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
    timestamp: new Date(),
    version: '1.0',
  });

  useEffect(() => {
    // Check if user has already given consent
    const existingConsent = localStorage.getItem('cookie_consent');
    if (!existingConsent) {
      setIsVisible(true);
    } else {
      try {
        const parsedConsent = JSON.parse(existingConsent);
        setConsent(parsedConsent);
        onConsentChange?.(parsedConsent);
      } catch (error) {
        // Invalid consent data, show banner again
        setIsVisible(true);
      }
    }
  }, [onConsentChange]);

  const handleConsentChange = (category: keyof CookieConsent, value: boolean) => {
    if (category === 'necessary') return; // Cannot disable necessary cookies

    setConsent(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  const saveConsent = (acceptAll: boolean = false) => {
    const finalConsent: CookieConsent = acceptAll
      ? {
          necessary: true,
          analytics: true,
          marketing: true,
          preferences: true,
          timestamp: new Date(),
          version: '1.0',
        }
      : {
          ...consent,
          timestamp: new Date(),
          version: '1.0',
        };

    // Save to localStorage
    localStorage.setItem('cookie_consent', JSON.stringify(finalConsent));

    // Record consent in compliance system
    const sessionId = getSessionId();
    const userId = getUserId(); // This would come from your auth system
    recordUserConsent(userId, sessionId, finalConsent);

    // Notify parent component
    onConsentChange?.(finalConsent);

    // Hide banner
    setIsVisible(false);

    // Apply consent settings
    applyConsentSettings(finalConsent);
  };

  const applyConsentSettings = (consentSettings: CookieConsent) => {
    // Enable/disable analytics based on consent
    if (consentSettings.analytics) {
      // Initialize analytics (Google Analytics, etc.)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted',
        });
      }
    } else {
      // Disable analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'denied',
        });
      }
    }

    // Enable/disable marketing cookies
    if (consentSettings.marketing) {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
        });
      }
    } else {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        });
      }
    }
  };

  const getSessionId = (): string => {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  };

  const getUserId = (): string | undefined => {
    // This would integrate with your authentication system
    // For now, return undefined for anonymous users
    return undefined;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
      <div className="bg-white border border-gray-200 rounded-lg shadow-xl max-w-4xl w-full pointer-events-auto">
        {!showDetails ? (
          // Simple banner view
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    We value your privacy
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    We use cookies to enhance your browsing experience, serve personalized content, 
                    and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                aria-label="Close cookie banner"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => saveConsent(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Accept All
              </button>
              <button
                onClick={() => saveConsent(false)}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                Accept Necessary Only
              </button>
              <button
                onClick={() => setShowDetails(true)}
                className="bg-white text-blue-600 px-6 py-2 rounded-md border border-blue-600 hover:bg-blue-50 transition-colors flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Customize</span>
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Learn more in our{' '}
              <a href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </a>
            </div>
          </div>
        ) : (
          // Detailed settings view
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Cookie Preferences
              </h3>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close cookie settings"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 mb-6">
              {cookieCategories.map((category) => (
                <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="text-blue-600 mt-1">
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">
                            {category.name}
                          </h4>
                          <div className="flex items-center">
                            {category.required ? (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                Required
                              </span>
                            ) : (
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={Boolean(consent[category.id])}
                                  onChange={(e) => handleConsentChange(category.id, e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {category.description}
                        </p>
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 font-medium">Examples:</p>
                          <p className="text-xs text-gray-500">
                            {category.examples.join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => saveConsent(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Accept All
              </button>
              <button
                onClick={() => saveConsent(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Save Preferences
              </button>
              <button
                onClick={() => setShowDetails(false)}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}