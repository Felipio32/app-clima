import { useState, useEffect } from "react";
import axios from "axios";
import Weather from "./components/Weather";

const API_KEY = "1efa759560f28ef6abc85a49cff5a7dd";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?";

const codes = {
  thunderstorm: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
  drizzle: [300, 301, 302, 310, 311, 312, 313, 314, 321],
  rain: [500, 501, 502, 503, 504, 511, 520, 521, 522, 531],
  snow: [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622],
  atmosphere: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
  clear: [800],
  clouds: [801, 802, 803, 804],
};

const icons = {
  thunderstorm: "⛈️",
  drizzle: "🌦️",
  rain: "🌧️",
  snow: "❄️",
  atmosphere: "🌫️",
  clear: "☀️",
  clouds: "☁️",
};

function App() {
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [geoPermissionDenied, setGeoPermissionDenied] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setCoords({ lat: coords.latitude, lon: coords.longitude });
        },
        () => {
          setGeoPermissionDenied(true);
          setLoading(false);
        }
      );
    } else {
      setGeoPermissionDenied(true);
      setLoading(false);
    }
  }, []);

  const fetchWeather = (url) => {
    setLoading(true);
    axios
      .get(url)
      .then((res) => {
        const codeId = res.data.weather[0].id;
        const keys = Object.keys(codes);
        setWeather({
          city: res.data.name,
          country: res.data.sys.country,
          temp: res.data.main.temp,
          description: res.data.weather[0].description.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
          icon: icons[keys.find((k) => codes[k].includes(codeId))],
          wind: res.data.wind.speed,
          clouds: res.data.clouds.all,
          pressure: res.data.main.pressure,
        });
      })
      .catch(() => {
        setWeather(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (coords) {
      fetchWeather(
        `${BASE_URL}lat=${coords.lat}&lon=${coords.lon}&units=metric&lang=es&appid=${API_KEY}`
      );
    }
  }, [coords]);

  const handleSearch = () => {
    if (city) {
      fetchWeather(`${BASE_URL}q=${city}&units=metric&lang=es&appid=${API_KEY}`);
      setCity("");
    }
  };

  return (
    <div className="container">
      {loading ? (
        <h2 className="loading">Loading...</h2>
      ) : (
        <>
          <div>
            <input
              type="text"
              placeholder="Ingrese la ciudad"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button onClick={handleSearch}>Buscar</button>
          </div>

          {weather ? <Weather weather={weather} /> : geoPermissionDenied && <p>You denied location access. Please search for a city.</p>}
        </>
      )}
    </div>
  );
}

export default App;
