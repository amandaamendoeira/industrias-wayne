import React, { createContext, useContext, useState, useEffect } from 'react';

interface TimezoneContextType {
  timezone: string;
  setTimezone: (timezone: string) => void;
  formatDate: (date: string | Date) => string;
  formatDateTime: (date: string | Date) => string;
  formatTime: (date: string | Date) => string;
  getCurrentTime: () => string;
}

const TimezoneContext = createContext<TimezoneContextType | undefined>(undefined);

const timezoneOptions = {
  'America/Sao_Paulo': { name: 'São Paulo (UTC-3)', offset: -3 },
  'America/New_York': { name: 'New York (UTC-5)', offset: -5 },
  'Europe/London': { name: 'London (UTC+0)', offset: 0 },
  'Asia/Tokyo': { name: 'Tokyo (UTC+9)', offset: 9 },
  'Australia/Sydney': { name: 'Sydney (UTC+11)', offset: 11 },
  'Europe/Paris': { name: 'Paris (UTC+1)', offset: 1 },
  'America/Los_Angeles': { name: 'Los Angeles (UTC-8)', offset: -8 }
};

export function TimezoneProvider({ children }: { children: React.ReactNode }) {
  const [timezone, setTimezoneState] = useState('America/Sao_Paulo');

  useEffect(() => {
    const savedTimezone = localStorage.getItem('wayne-timezone');
    if (savedTimezone && timezoneOptions[savedTimezone as keyof typeof timezoneOptions]) {
      setTimezoneState(savedTimezone);
    }
  }, []);

  const setTimezone = (newTimezone: string) => {
    setTimezoneState(newTimezone);
    localStorage.setItem('wayne-timezone', newTimezone);
  };

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    try {
      return new Intl.DateTimeFormat('pt-BR', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(dateObj);
    } catch (error) {
      return dateObj.toLocaleDateString('pt-BR');
    }
  };

  const formatDateTime = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    try {
      return new Intl.DateTimeFormat('pt-BR', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj);
    } catch (error) {
      return dateObj.toLocaleString('pt-BR');
    }
  };

  const formatTime = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    try {
      return new Intl.DateTimeFormat('pt-BR', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(dateObj);
    } catch (error) {
      return dateObj.toLocaleTimeString('pt-BR');
    }
  };

  const getCurrentTime = () => {
    return formatDateTime(new Date());
  };

  return (
    <TimezoneContext.Provider value={{
      timezone,
      setTimezone,
      formatDate,
      formatDateTime,
      formatTime,
      getCurrentTime
    }}>
      {children}
    </TimezoneContext.Provider>
  );
}

export function useTimezone() {
  const context = useContext(TimezoneContext);
  if (context === undefined) {
    throw new Error('useTimezone must be used within a TimezoneProvider');
  }
  return context;
}

export { timezoneOptions };