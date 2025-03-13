import React, { useState } from "react";

function Weather({ weather }) {
  const [isCelsius, setIsCelsius] = useState(true);

  const toggleTemperature = () => {
    setIsCelsius(!isCelsius);
  };

  const temperature = isCelsius
    ? weather.temp
    : (weather.temp * 9) / 5 + 32;

  return (
    <div className="weather">
      <h1>{weather.city}, {weather.country}</h1>
      <div className="weather-info">
        <span role="img" aria-label="icon" style={{ fontSize: '4rem' }} className="weather-icon">
          {weather.icon}
        </span>
        <p>"{weather.description}"</p>
        <ul>
          <li>Velocidad del viento: <strong>{weather.wind} m/s</strong></li>
          <li>Nubes: <strong>{weather.clouds}%</strong></li>
          <li>Presión: <strong>{weather.pressure} hPa</strong></li>
        </ul>
        <h3>{temperature.toFixed(1)}°{isCelsius ? "C" : "F"}</h3>
        <button onClick={toggleTemperature}>
          Cambiar a {isCelsius ? "°F" : "°C"}
        </button>
      </div>
    </div>
  );
}

export default Weather;
