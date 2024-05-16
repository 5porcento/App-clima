import React, { useState, useEffect } from 'react';

function Weather() {
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5084/weather?lat=43.0004&lon=-75.4999')
            .then(response => response.json())
            .then(data => setWeather(data))
            .catch(error => console.error("Erro ao buscar dados meteorológicos:", error));
    }, []);
     const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#ADD8E6', // Cor de fundo azul claro
    };

    const weatherStyle = {
        padding: '20px',
        margin: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        textAlign: 'center',
    };

    const titleStyle = {
        color: '#333',
    };

    const loadingStyle = {
        color: 'gray',
        fontStyle: 'italic',
    };

    // Função para selecionar o emoji baseado na condição
    const getWeatherEmoji = (condition) => {
        switch (condition) {
            case 'nublado':
                return '☁️';
            case 'parcialmente nublado':
                return '⛅';
            case 'céu limpo':
                return '☀️';
            case 'chuva leve':
                return '🌦️';
            case 'chuva forte':
                return '🌧️'; 
            case 'nuvens dispersas':
                return '☁️'; 
            // Adicione mais casos conforme necessário
            default:
                return ''; // Retorna um string vazio se a condição não corresponder
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            {weather ? (
                <div style={weatherStyle}>
                    <h1 style={titleStyle}>Condições Meteorológicas</h1>
                    <p>Temperatura: {weather.temperatura}°C</p>
                    <p>Condição: {weather.condição} {getWeatherEmoji(weather.condição)}</p>
                </div>
            ) : (
                <p style={loadingStyle}>Carregando dados meteorológicos...</p>
            )}
        </div>
    );
}

export default Weather;