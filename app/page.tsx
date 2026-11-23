'use client';
import { useState } from "react";

function App() {
  const [city, setcity] = useState('');
  const [weather, setweather] = useState<any>(null);
  const [loading, setloading] = useState(false);
  
  const [error, seterror] = useState<string | null>(null);

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  const getWeatherData = async (query: string) => {
    setloading(true);
    seterror(null);
    setweather(null);

    try {
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${query}`);
      
      if (!response.ok) {
        throw new Error("City not found or API error");
      }
      
      const data = await response.json();
      setweather(data); 
    } catch (error: any) {
      seterror(error.message);
      setweather(null);
    } finally {
      setloading(false);
    }
  };

  // البحث باسم المدينة
  const fetchWeather = () => {
    if (!city.trim()) return;
    getWeatherData(city);
  };

  // 2. فصل دالة الموقع الحالي وإكمال الـ fetch بداخلها
  const getcurrentlocation = () => {
    if (!navigator.geolocation) {
      seterror("Geolocation is not supported by your browser");
      return;
    }

    setloading(true);
    seterror(null);
    setweather(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherData(`${latitude},${longitude}`);
      },
      () => {
        setloading(false);
        seterror("Unable to retrieve your location. Please allow location access.");
      }
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 font-sans p-4"> 
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg text-gray-100 flex flex-col gap-4">
        
        <h1 className="text-3xl font-bold mb-2 text-center">Weather App</h1>

        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Enter city Name"
            className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-blue-500"
            value={city}
            onChange={(e) => {
              setcity(e.target.value);
              setweather(null);
              if (error) seterror(null);
            }}
          />
          
          <button 
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold transition disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer" 
            onClick={fetchWeather}
            disabled={loading || city.trim() === ''}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <button 
          className="w-full py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 border border-gray-600 font-medium transition disabled:opacity-50 cursor-pointer" 
          onClick={getcurrentlocation}
          disabled={loading}
        >
          Get Current Location Weather
        </button>

        {loading && <p className="text-center text-blue-400 animate-pulse">Loading weather data...</p>}
        
        {error && (
          <p className="text-center text-red-400 bg-red-950/50 border border-red-800 rounded-lg p-2.5 text-sm">
            {error}
          </p>
        )}

        {weather && (
          <div className="mt-2 bg-gray-700/60 p-6 rounded-lg flex flex-col items-center text-center gap-2 border border-gray-600">
            <h2 className="text-xl font-semibold">
              {weather.location.name}, {weather.location.country}
            </h2>
            <img 
              src={`https:${weather.current.condition.icon}`} 
              alt={weather.current.condition.text} 
              className="w-16 h-16"
            />
            <p className="text-4xl font-bold text-blue-400">{weather.current.temp_c}°C</p>
            <p className="text-gray-300">{weather.current.condition.text}</p>
            <div className="w-full flex justify-around mt-3 pt-3 border-t border-gray-600 text-sm text-gray-300">
              <p>Humidity: {weather.current.humidity}%</p>
              <p>Wind: {weather.current.wind_kph} km/h</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
