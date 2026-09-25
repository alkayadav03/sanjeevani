'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const DICTIONARY: Translations = {
  // Brand & Header
  appTitle: {
    en: 'SwasthyaResilience AI',
    hi: 'स्वास्थ्य रेज़िलिएंस एआई',
  },
  appSubtitle: {
    en: 'Smart Health & Supply Chain Resilience Platform',
    hi: 'स्मार्ट स्वास्थ्य एवं आपूर्ति श्रृंखला रेज़िलिएंस प्लेटफॉर्म',
  },
  disclaimerBanner: {
    en: 'Hackathon prototype using synthetic/demo healthcare data. Not connected to live government healthcare systems and not intended for clinical decision-making.',
    hi: 'सिंथेटिक/डेमो स्वास्थ्य डेटा का उपयोग करने वाला हैकथॉन प्रोटोटाइप। लाइव सरकारी स्वास्थ्य प्रणालियों से जुड़ा नहीं है और नैदानिक निर्णय लेने के लिए अभिप्रेत नहीं है।',
  },

  // Nav Items
  navOverview: { en: 'Overview', hi: 'अवलोकन' },
  navPhcNetwork: { en: 'PHC Network', hi: 'पीएचसी नेटवर्क' },
  navInventory: { en: 'Medicine Inventory', hi: 'दवा इन्वेंटरी' },
  navPatients: { en: 'Patients & OPD', hi: 'रोगी एवं ओपीडी' },
  navBeds: { en: 'Bed Capacity', hi: 'बिस्तर क्षमता' },
  navStaff: { en: 'Staff & Roster', hi: 'कर्मचारी एवं रोस्टर' },
  navForecasts: { en: 'AI Forecasts', hi: 'एआई पूर्वानुमान' },
  navAlerts: { en: 'Stock Alerts', hi: 'स्टॉक अलर्ट' },
  navRedistribution: { en: 'Redistribution', hi: 'संसाधन पुनर्वितरण' },
  navEmergency: { en: 'Emergency Mode', hi: 'आपातकालीन मोड' },
  navFederated: { en: 'Federated AI', hi: 'फेडरेटेड एआई' },
  navAnalytics: { en: 'Analytics', hi: 'एनालिटिक्स' },
  navReports: { en: 'Reports', hi: 'रिपोर्ट्स' },
  navSettings: { en: 'Settings', hi: 'सेटिंग्स' },

  // Risk Badges
  badgeNormal: { en: 'NORMAL', hi: 'सामान्य' },
  badgeWarning: { en: 'WARNING', hi: 'चेतावनी' },
  badgeHighRisk: { en: 'HIGH RISK', hi: 'उच्च जोखिम' },
  badgeCritical: { en: 'CRITICAL', hi: 'गंभीर संकट' },

  // KPIs
  kpiTotalPhcs: { en: 'Total PHCs Monitored', hi: 'कुल निगरानी वाले पीएचसी' },
  kpiDistricts: { en: 'Districts Covered', hi: 'कवर किए गए जिले' },
  kpiBeds: { en: 'Bed Availability', hi: 'उपलब्ध बिस्तर' },
  kpiPatients: { en: 'Patients Today', hi: 'आज के मरीज' },
  kpiStaff: { en: 'Staff Attendance', hi: 'कर्मचारी उपस्थिति' },
  kpiStockAlerts: { en: 'Active Stock Alerts', hi: 'सक्रिय स्टॉक अलर्ट' },
  kpiCriticalAlerts: { en: 'Critical Stock-outs', hi: 'गंभीर दवा संकट' },

  // Actions
  simulateEmergency: { en: '🚨 Simulate Health Emergency', hi: '🚨 आपातकाल का अनुकरण करें' },
  resetDemo: { en: 'Reset Demo', hi: 'डेमो रीसेट करें' },
  askGeminiWhy: { en: 'Ask Gemini Why?', hi: 'जेमिनी से कारण पूछें' },
  readAloud: { en: 'Read Aloud', hi: 'सुनें (आवाज)' },
  reading: { en: 'Reading...', hi: 'सुनाई दे रहा है...' },
  stopReading: { en: 'Stop', hi: 'रोकें' },
  approveTransfer: { en: 'Approve Transfer', hi: 'स्थानांतरण स्वीकृत करें' },
  rejectTransfer: { en: 'Reject', hi: 'अस्वीकार करें' },
  transferReceived: { en: 'Mark Received', hi: 'प्राप्त के रूप में चिह्नित करें' },
  startTraining: { en: 'Start Federated Training', hi: 'फेडरेटेड प्रशिक्षण शुरू करें' },
  exportReport: { en: 'Print / Save PDF Report', hi: 'रिपोर्ट प्रिंट / पीडीएफ सहेजें' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  speak: (text: string) => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
  speak: () => {},
  isSpeaking: false,
  stopSpeaking: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('swasthya_lang') as Language;
    if (saved === 'en' || saved === 'hi') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('swasthya_lang', lang);
    }
  };

  const t = (key: string): string => {
    if (DICTIONARY[key]) {
      return DICTIONARY[key][language] || DICTIONARY[key]['en'];
    }
    return key;
  };

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this device/browser.');
      return;
    }

    window.speechSynthesis.cancel();

    // Strip bracketed system notes from voice reading
    const cleanText = text.replace(/\[.*?\]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        speak,
        isSpeaking,
        stopSpeaking,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
