import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TimezoneMeetingPlanner = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimezones, setSelectedTimezones] = useState([
    'Europe/London',
    'Australia/Sydney'
  ]);
  const [sliderHour, setSliderHour] = useState(new Date().getHours());

  const timezones = [
    { value: 'Europe/London', label: 'London' },
    { value: 'America/New_York', label: 'New York' },
    { value: 'America/Los_Angeles', label: 'Los Angeles' },
    { value: 'America/Chicago', label: 'Chicago' },
    { value: 'Europe/Paris', label: 'Paris' },
    { value: 'Europe/Berlin', label: 'Berlin' },
    { value: 'Asia/Tokyo', label: 'Tokyo' },
    { value: 'Asia/Shanghai', label: 'Shanghai' },
    { value: 'Asia/Singapore', label: 'Singapore' },
    { value: 'Asia/Dubai', label: 'Dubai' },
    { value: 'Australia/Sydney', label: 'Sydney' },
    { value: 'Pacific/Auckland', label: 'Auckland' },
    { value: 'Asia/Hong_Kong', label: 'Hong Kong' },
    { value: 'Asia/Kolkata', label: 'Mumbai' },
    { value: 'Europe/Moscow', label: 'Moscow' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeInTimezone = (timezone, hour = null) => {
    const date = new Date(currentTime);
    if (hour !== null) {
      date.setHours(hour, 0, 0, 0);
    }
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  };

  const getHourInTimezone = (timezone, baseHour) => {
    const londonDate = new Date(currentTime);
    londonDate.setHours(baseHour, 0, 0, 0);
    
    const tzTime = londonDate.toLocaleString('en-US', { 
      timeZone: timezone, 
      hour: '2-digit', 
      hour12: false 
    });
    return parseInt(tzTime);
  };

  const addTimezone = (timezone) => {
    if (!selectedTimezones.includes(timezone)) {
      setSelectedTimezones([...selectedTimezones, timezone]);
    }
  };

  const removeTimezone = (timezone) => {
    setSelectedTimezones(selectedTimezones.filter(tz => tz !== timezone));
  };

  const isWorkingHour = (hour) => {
    return hour >= 8 && hour < 18;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Timezone Meeting Planner</h1>
          <p className="text-gray-600 mb-4">Find the perfect meeting time across timezones</p>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Add Timezone</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md"
              onChange={(e) => {
                if (e.target.value) {
                  addTimezone(e.target.value);
                  e.target.value = '';
                }
              }}
            >
              <option value="">Select a timezone...</option>
              {timezones.filter(tz => !selectedTimezones.includes(tz.value)).map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Explore Time: {sliderHour.toString().padStart(2, '0')}:00 (London)
            </label>
            <input 
              type="range" 
              min="0" 
              max="23" 
              value={sliderHour}
              onChange={(e) => setSliderHour(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-4">
          {selectedTimezones.map(timezone => {
            const tzLabel = timezones.find(tz => tz.value === timezone)?.label || timezone;
            const currentHour = getHourInTimezone(timezone, sliderHour);
            
            return (
              <div key={timezone} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{tzLabel}</h3>
                    <p className="text-2xl font-bold text-indigo-600">
                      {getTimeInTimezone(timezone, sliderHour)}
                    </p>
                  </div>
                  {selectedTimezones.length > 1 && (
                    <button 
                      onClick={() => removeTimezone(timezone)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={24} />
                    </button>
                  )}
                </div>
                
                <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex">
                    {[...Array(24)].map((_, hour) => {
                      const actualHour = getHourInTimezone(timezone, hour);
                      const isWorking = isWorkingHour(actualHour);
                      const isCurrentHour = hour === sliderHour;
                      
                      return (
                        <div 
                          key={hour}
                          className={`flex-1 border-r border-gray-200 ${
                            isWorking ? 'bg-green-200' : 'bg-gray-50'
                          } ${isCurrentHour ? 'ring-2 ring-indigo-500 ring-inset' : ''}`}
                        >
                          <div className="text-xs text-center text-gray-600 mt-1">
                            {actualHour.toString().padStart(2, '0')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>00:00</span>
                  <span className="text-green-600 font-medium">Green = Working Hours (08:00-18:00)</span>
                  <span>23:00</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimezoneMeetingPlanner;

