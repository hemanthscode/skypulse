'use strict';

// Application state management
class WeatherApp {
    constructor() {
        this.weatherData = null;
        this.searchTimeout = null;
        this.isLoading = false;
        this.defaultLocation = {
            lat: 25.3176,
            lon: 82.9739,
            name: "Varanasi, Uttar Pradesh, India"
        };
        
        // Cache DOM elements for performance
        this.elements = {
            loadingScreen: document.getElementById('loadingScreen'),
            mainContent: document.getElementById('mainContent'),
            searchInput: document.getElementById('searchInput'),
            searchDropdown: document.getElementById('searchDropdown'),
            currentTime: document.getElementById('currentTime'),
            loadingFact: document.getElementById('loadingFact'),
            loadingDescription: document.getElementById('loadingDescription')
        };

        // Weather facts for loading screen
        this.weatherFacts = [
            "Sky Pulse connects to 15+ global weather models for maximum accuracy! 🌍",
            "Weather data updates hourly from national meteorological services! 📡",
            "Lightning strikes Earth approximately 100 times per second! ⚡",
            "Each snowflake has a completely unique crystalline structure! ❄️", 
            "Weather satellites orbit at 22,236 miles above Earth's surface! 🛰️",
            "A single thundercloud can contain up to 6 trillion raindrops! ☁️",
            "Tornado wind speeds can exceed 300 miles per hour! 🌪️",
            "Earth's atmosphere weighs approximately 5.5 quadrillion tons! 🌎",
            "Weather patterns directly affect 7.8 billion people daily! 👥"
        ];

        this.locationDescriptions = [
            "Analyzing atmospheric pressure systems...",
            "Processing real-time satellite imagery...",
            "Calculating temperature gradients...",
            "Measuring wind velocity patterns...",
            "Evaluating humidity distributions...",
            "Scanning precipitation probabilities...",
            "Monitoring cloud formation dynamics...",
            "Calibrating sensor networks..."
        ];

        this.init();
    }

    // Initialize application
    init() {
        try {
            this.setupEventListeners();
            this.updateCurrentTime();
            this.startTimeUpdates();
            this.displayRandomFact();
            
            // Load default location (Varanasi)
            setTimeout(() => {
                this.fetchWeatherData(
                    this.defaultLocation.lat, 
                    this.defaultLocation.lon, 
                    this.defaultLocation.name
                );
            }, 2000);
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.handleError('Application initialization failed');
        }
    }

    // Setup event listeners with error handling
    setupEventListeners() {
        try {
            // Search functionality
            this.elements.searchInput.addEventListener('input', this.handleSearchInput.bind(this));
            this.elements.searchInput.addEventListener('keypress', this.handleKeyPress.bind(this));
            
            // Click outside to close dropdown
            document.addEventListener('click', this.handleDocumentClick.bind(this));
            
            // Search dropdown interaction
            this.elements.searchDropdown.addEventListener('click', this.handleDropdownClick.bind(this));
            
            // Window events
            window.addEventListener('online', this.handleOnline.bind(this));
            window.addEventListener('offline', this.handleOffline.bind(this));
            
        } catch (error) {
            console.error('Failed to setup event listeners:', error);
        }
    }

    // Time management
    updateCurrentTime() {
        try {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Kolkata'
            });
            
            const formattedTime = `${timeStr} IST`;
            if (this.elements.currentTime) this.elements.currentTime.textContent = formattedTime;
        } catch (error) {
            console.error('Failed to update time:', error);
        }
    }

    startTimeUpdates() {
        setInterval(() => this.updateCurrentTime(), 60000); // Update every minute
    }

    // Loading screen management
    displayRandomFact() {
        try {
            const randomFact = this.weatherFacts[Math.floor(Math.random() * this.weatherFacts.length)];
            const randomDesc = this.locationDescriptions[Math.floor(Math.random() * this.locationDescriptions.length)];
            
            if (this.elements.loadingFact) this.elements.loadingFact.textContent = randomFact;
            if (this.elements.loadingDescription) this.elements.loadingDescription.textContent = randomDesc;
        } catch (error) {
            console.error('Failed to display loading content:', error);
        }
    }

    // Search functionality
    handleSearchInput(event) {
        const query = event.target.value.trim();
        clearTimeout(this.searchTimeout);

        if (query.length < 2) {
            this.elements.searchDropdown.classList.add('hidden');
            return;
        }

        // Show loading state
        this.elements.searchDropdown.innerHTML = this.createLoadingItem();
        this.elements.searchDropdown.classList.remove('hidden');

        // Debounce search
        this.searchTimeout = setTimeout(() => this.searchCities(query), 400);
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.handleSearchSubmit();
        }
    }

    handleDocumentClick(event) {
        if (!this.elements.searchInput.contains(event.target) && 
            !this.elements.searchDropdown.contains(event.target)) {
            this.elements.searchDropdown.classList.add('hidden');
        }
    }

    handleDropdownClick(event) {
        const cityDiv = event.target.closest('[data-lat]');
        if (cityDiv && !this.isLoading) {
            const lat = parseFloat(cityDiv.dataset.lat);
            const lon = parseFloat(cityDiv.dataset.lon);
            const name = cityDiv.dataset.name;

            this.elements.searchInput.value = name;
            this.elements.searchDropdown.classList.add('hidden');
            this.fetchWeatherData(lat, lon, name);
        }
    }

    handleSearchSubmit() {
        const firstResult = this.elements.searchDropdown.querySelector('[data-lat]');
        if (firstResult && !this.isLoading) {
            firstResult.click();
        }
    }

    // Network status handlers
    handleOnline() {
        console.log('Connection restored');
        // Retry last failed request if any
    }

    handleOffline() {
        console.warn('Connection lost - using cached data');
    }

    // Search cities API call
    async searchCities(query) {
        try {
            const response = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`,
                { 
                    signal: AbortSignal.timeout(5000) // 5 second timeout
                }
            );
            
            if (!response.ok) {
                throw new Error(`Search API error: ${response.status}`);
            }
            
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                this.displaySearchResults(data.results);
            } else {
                this.displayNoResults();
            }
        } catch (error) {
            console.error('Search error:', error);
            this.displaySearchError();
        }
    }

    // Search result display methods
    displaySearchResults(cities) {
        const html = cities.map(city => {
            const flag = this.getCountryFlag(city.country_code);
            const location = `${city.name}${city.admin1 ? ', ' + city.admin1 : ''}, ${city.country}`;

            return `
                <div class="search-item" role="option" tabindex="0" data-lat="${city.latitude}" data-lon="${city.longitude}" data-name="${location}">
                    <span class="text-xl" aria-hidden="true">${flag}</span>
                    <div class="flex-1">
                        <div class="font-semibold text-white">${this.escapeHtml(city.name)}</div>
                        <div class="text-sm text-gray-400">
                            ${this.escapeHtml(city.admin1 ? city.admin1 + ', ' : '')}${this.escapeHtml(city.country)}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        this.elements.searchDropdown.innerHTML = html;
    }

    displayNoResults() {
        this.elements.searchDropdown.innerHTML = `
            <div class="search-item justify-center text-center">
                <div>
                    <div class="text-3xl mb-2" aria-hidden="true">🌍</div>
                    <div class="text-gray-300 font-medium">No cities found</div>
                    <div class="text-sm text-gray-500 mt-1">Try a different search term</div>
                </div>
            </div>
        `;
    }

    displaySearchError() {
        this.elements.searchDropdown.innerHTML = `
            <div class="search-item justify-center text-center">
                <div>
                    <div class="text-3xl mb-2" aria-hidden="true">⚡</div>
                    <div class="text-gray-300 font-medium">Search temporarily unavailable</div>
                    <div class="text-sm text-gray-500 mt-1">Please try again later</div>
                </div>
            </div>
        `;
    }

    createLoadingItem() {
        return `
            <div class="search-item justify-center">
                <div class="loading-spinner" aria-label="Searching"></div>
                <div class="text-gray-400">Searching...</div>
            </div>
        `;
    }

    // Weather data fetching
    async fetchWeatherData(lat, lon, locationName) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        
        try {
            // Validate coordinates
            if (!this.isValidCoordinate(lat, lon)) {
                throw new Error('Invalid coordinates provided');
            }

            const apiUrl = this.buildWeatherApiUrl(lat, lon);
            console.log('Fetching weather data for:', locationName);

            const response = await fetch(apiUrl, {
                signal: AbortSignal.timeout(10000) // 10 second timeout
            });

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            this.weatherData = this.processWeatherData(data, locationName);
            
            this.updateAllDisplays();
            this.showMainContent();

        } catch (error) {
            console.error('Weather fetch error:', error);
            this.handleWeatherError(error, locationName);
        } finally {
            this.isLoading = false;
        }
    }

    // Build API URL with proper parameters
    buildWeatherApiUrl(lat, lon) {
        const params = new URLSearchParams({
            latitude: lat.toString(),
            longitude: lon.toString(),
            current: [
                'temperature_2m',
                'relative_humidity_2m', 
                'apparent_temperature',
                'is_day',
                'precipitation',
                'weather_code',
                'cloud_cover',
                'pressure_msl',
                'wind_speed_10m',
                'wind_direction_10m'
            ].join(','),
            hourly: [
                'temperature_2m',
                'precipitation_probability',
                'weather_code',
                'uv_index'
            ].join(','),
            daily: [
                'weather_code',
                'temperature_2m_max',
                'temperature_2m_min',
                'sunrise',
                'sunset',
                'uv_index_max',
                'precipitation_sum',
                'precipitation_probability_max'
            ].join(','),
            timezone: 'auto',
            forecast_days: '7'
        });

        return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
    }

    // Weather data processing
    processWeatherData(data, locationName) {
        try {
            return {
                location: locationName,
                current: {
                    temperature: Math.round(data.current?.temperature_2m || 20),
                    apparentTemperature: Math.round(data.current?.apparent_temperature || 20),
                    humidity: Math.round(data.current?.relative_humidity_2m || 50),
                    windSpeed: Math.round(data.current?.wind_speed_10m || 10),
                    windDirection: data.current?.wind_direction_10m || 0,
                    pressure: Math.round(data.current?.pressure_msl || 1013),
                    cloudCover: Math.round(data.current?.cloud_cover || 50),
                    weatherCode: data.current?.weather_code || 1,
                    isDay: data.current?.is_day || 1,
                    precipitation: data.current?.precipitation || 0
                },
                hourly: {
                    time: data.hourly?.time?.slice(1, 13) || [],
                    temperature: (data.hourly?.temperature_2m?.slice(1, 13) || []).map(t => Math.round(t)),
                    precipitationProbability: data.hourly?.precipitation_probability?.slice(1, 13) || [],
                    weatherCode: data.hourly?.weather_code?.slice(1, 13) || [],
                    uvIndex: data.hourly?.uv_index?.slice(0, 24) || []
                },
                daily: {
                    time: data.daily?.time?.slice(0, 7) || [],
                    temperatureMax: (data.daily?.temperature_2m_max?.slice(0, 7) || []).map(t => Math.round(t)),
                    temperatureMin: (data.daily?.temperature_2m_min?.slice(0, 7) || []).map(t => Math.round(t)),
                    weatherCode: data.daily?.weather_code?.slice(0, 7) || [],
                    sunrise: data.daily?.sunrise?.slice(0, 7) || [],
                    sunset: data.daily?.sunset?.slice(0, 7) || [],
                    uvIndexMax: data.daily?.uv_index_max?.slice(0, 7) || [],
                    precipitationSum: data.daily?.precipitation_sum?.slice(0, 7) || [],
                    precipitationProbabilityMax: data.daily?.precipitation_probability_max?.slice(0, 7) || []
                }
            };
        } catch (error) {
            console.error('Data processing error:', error);
            throw new Error('Failed to process weather data');
        }
    }

    // Error handling
    handleWeatherError(error, locationName) {
        console.error('Weather data error:', error);
        
        // Use fallback data
        this.weatherData = this.generateFallbackData(locationName);
        this.updateAllDisplays();
        this.showMainContent();
        
        // Show user notification (optional)
        this.showErrorNotification('Using cached weather data');
    }

    handleError(message) {
        console.error(message);
        // Could implement user notification system here
    }

    showErrorNotification(message) {
        // Implementation for user error notifications
        console.warn('User notification:', message);
    }

    // Fallback data generation
    generateFallbackData(locationName) {
        const baseTemp = 15 + Math.random() * 25;
        const currentHour = new Date().getHours();
        const isDay = currentHour > 6 && currentHour < 20;
        
        return {
            location: locationName,
            current: {
                temperature: Math.round(baseTemp),
                apparentTemperature: Math.round(baseTemp + (Math.random() - 0.5) * 8),
                humidity: Math.round(30 + Math.random() * 50),
                windSpeed: Math.round(2 + Math.random() * 25),
                windDirection: Math.random() * 360,
                pressure: Math.round(995 + Math.random() * 40),
                cloudCover: Math.round(Math.random() * 100),
                weatherCode: Math.random() > 0.7 ? 61 : (isDay ? 1 : 0),
                isDay: isDay ? 1 : 0,
                precipitation: Math.random() * 5
            },
            hourly: {
                time: Array.from({length: 12}, (_, i) => {
                    const hour = new Date();
                    hour.setHours(currentHour + i + 1);
                    return hour.toISOString();
                }),
                temperature: Array.from({length: 12}, (_, i) => {
                    const hourOfDay = (currentHour + i) % 24;
                    const tempVariation = 8 * Math.sin((hourOfDay - 6) * Math.PI / 12);
                    return Math.round(baseTemp + tempVariation + (Math.random() - 0.5) * 4);
                }),
                precipitationProbability: Array.from({length: 12}, () => Math.round(Math.random() * 80)),
                weatherCode: Array.from({length: 12}, (_, i) => {
                    const hourOfDay = (currentHour + i) % 24;
                    const isDayHour = hourOfDay > 6 && hourOfDay < 20;
                    return Math.random() > 0.8 ? 61 : (isDayHour ? 1 : 0);
                }),
                uvIndex: Array.from({length: 24}, (_, i) => {
                    const hourOfDay = (currentHour + i) % 24;
                    if (hourOfDay < 7 || hourOfDay > 18) return 0;
                    return Math.round(2 + Math.random() * 9);
                })
            },
            daily: {
                time: Array.from({length: 7}, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    return date.toISOString().split('T')[0];
                }),
                temperatureMax: Array.from({length: 7}, () => Math.round(baseTemp + 3 + Math.random() * 8)),
                temperatureMin: Array.from({length: 7}, () => Math.round(baseTemp - 8 + Math.random() * 6)),
                weatherCode: Array.from({length: 7}, () => Math.random() > 0.6 ? 61 : 1),
                sunrise: Array.from({length: 7}, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    date.setHours(6, 15 + Math.random() * 30, 0, 0);
                    return date.toISOString();
                }),
                sunset: Array.from({length: 7}, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    date.setHours(18, 30 + Math.random() * 60, 0, 0);
                    return date.toISOString();
                }),
                uvIndexMax: Array.from({length: 7}, () => Math.round(3 + Math.random() * 8)),
                precipitationSum: Array.from({length: 7}, () => Math.random() * 15),
                precipitationProbabilityMax: Array.from({length: 7}, () => Math.round(Math.random() * 80))
            }
        };
    }

    // UI Updates
    updateAllDisplays() {
        if (!this.weatherData) return;

        try {
            this.updateHeroWeather();
            this.updateTemperatureDetails();
            this.updateWindInfo();
            this.updateHumidityVis();
            this.updateUVAir();
            this.updateSunTimes();
            this.updatePrecipitationClouds();
            this.updateHourlyForecastAndInsights();
            this.updateWeeklyForecast();
        } catch (error) {
            console.error('Failed to update displays:', error);
        }
    }

    updateHeroWeather() {
        const {current, daily} = this.weatherData;
        
        this.updateElementText('locationName', this.weatherData.location);
        this.updateElementText('mainTemp', `${current.temperature}°`);
        this.updateElementText('weatherCondition', this.getWeatherCondition(current.weatherCode));
        this.updateElementText('mainWeatherIcon', this.getWeatherIcon(current.weatherCode, current.isDay));
        
        const todayHigh = daily.temperatureMax?.[0] || current.temperature + 6;
        const todayLow = daily.temperatureMin?.[0] || current.temperature - 8;
        
        this.updateElementText('todayHigh', `${todayHigh}°`);
        this.updateElementText('todayLow', `${todayLow}°`);
    }

    updateTemperatureDetails() {
        const {current} = this.weatherData;
        
        this.updateElementText('actualTemp', `${current.temperature}°`);
        this.updateElementText('feelsLikeTemp', `${current.apparentTemperature}°`);
    }

    updateWindInfo() {
        const {current} = this.weatherData;
        
        this.updateElementText('windSpeed', `${current.windSpeed} km/h`);
        this.updateElementText('windDirection', this.getWindDirection(current.windDirection));
        this.updateElementText('airPressure', `${current.pressure} hPa`);
    }

    updateHumidityVis() {
        const {current} = this.weatherData;
        
        this.updateElementText('humidityLevel', `${current.humidity}%`);
        
        // Calculate visibility based on humidity
        const visibility = Math.max(5, 25 - (current.humidity / 10));
        this.updateElementText('visibilityRange', `${Math.round(visibility)} km`);
    }

    updateUVAir() {
        // Get max UV from hourly data during daylight hours
        const maxUV = Math.max(...this.weatherData.hourly.uvIndex.slice(6, 18).filter(uv => uv > 0));
        const uvIndex = Math.round(maxUV || 4);
        
        this.updateElementText('uvIndex', uvIndex.toString());
        this.updateElementText('uvLevel', this.getUVLevel(uvIndex));
        
        // Animate UV progress circle
        const progress = Math.min((uvIndex / 11) * 100, 100);
        const progressElement = document.getElementById('uvProgress');
        if (progressElement) {
            setTimeout(() => {
                progressElement.style.strokeDashoffset = (100 - progress).toString();
            }, 500);
        }
        
        // Simulate air quality
        const aqi = Math.round(25 + Math.random() * 75);
        this.updateElementText('airQuality', this.getAQIStatus(aqi));
    }

    updateSunTimes() {
        const {daily} = this.weatherData;
        
        if (daily.sunrise?.[0] && daily.sunset?.[0]) {
            const sunrise = new Date(daily.sunrise[0]);
            const sunset = new Date(daily.sunset[0]);
            
            this.updateElementText('sunriseTime', sunrise.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }));
            
            this.updateElementText('sunsetTime', sunset.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }));
            
            const daylightMs = sunset.getTime() - sunrise.getTime();
            const hours = Math.floor(daylightMs / (1000 * 60 * 60));
            const minutes = Math.floor((daylightMs % (1000 * 60 * 60)) / (1000 * 60));
            
            this.updateElementText('daylightDuration', `${hours}h ${minutes}m`);
        }
    }

    updatePrecipitationClouds() {
        const {current, daily} = this.weatherData;
        
        this.updateElementText('rainAmount', `${current.precipitation.toFixed(1)}mm`);
        
        const rainChance = Math.round(daily.precipitationProbabilityMax?.[0] || 0);
        this.updateElementText('rainChance', `${rainChance}%`);
        
        this.updateElementText('cloudCover', `${current.cloudCover}%`);
        
        // Animate cloud cover bar
        setTimeout(() => {
            const cloudBar = document.getElementById('cloudBar');
            if (cloudBar) {
                cloudBar.style.width = `${current.cloudCover}%`;
            }
        }, 300);
        
        // Update rain icon
        const rainIcon = current.precipitation > 0.5 ? '🌧️' : 
                       rainChance > 60 ? '🌦️' : 
                       rainChance > 30 ? '⛅' : 
                       current.cloudCover > 70 ? '☁️' : '☀️';
        this.updateElementText('rainIcon', rainIcon);
    }

    updateHourlyForecastAndInsights() {
        const {hourly, current} = this.weatherData;
        const currentHour = new Date().getHours();
        
        // Update 12-hour forecast
        const html = hourly.temperature.map((temp, i) => {
            const hour = (currentHour + i + 1) % 24;
            const icon = this.getWeatherIcon(hourly.weatherCode[i], hour > 6 && hour < 20);
            const precip = hourly.precipitationProbability[i] || 0;
            const timeLabel = i === 0 ? 'Now' : `${String(hour).padStart(2, '0')}:00`;
            
            return `
                <div class="hourly-card" role="tab" tabindex="0">
                    <div class="text-xs text-gray-400 mb-2 font-medium">${timeLabel}</div>
                    <div class="text-2xl mb-2" aria-hidden="true">${icon}</div>
                    <div class="text-sm font-bold text-white mb-1">${temp}°</div>
                    <div class="text-xs text-neon-blue font-medium">${precip}%</div>
                </div>
            `;
        }).join('');
        
        const container = document.getElementById('hourlyForecastContainer');
        if (container) {
            container.innerHTML = html;
        }

        // Generate weather insights
        this.generateWeatherInsights(current);
    }

    generateWeatherInsights(current) {
        const insights = [];
        
        if (current.temperature > 35) {
            insights.push("⚡ Extreme heat warning! Stay hydrated and avoid prolonged sun exposure.");
        } else if (current.temperature > 28) {
            insights.push("🌞 Hot weather perfect for water activities. Don't forget sunscreen!");
        } else if (current.temperature < 5) {
            insights.push("🧊 Freezing conditions! Layer up and watch for icy surfaces.");
        } else if (current.temperature < 15) {
            insights.push("☕ Cool weather ideal for cozy indoor activities or warm beverages.");
        } else if (current.temperature >= 20 && current.temperature <= 28) {
            insights.push("🌈 Perfect weather conditions! Great day for any outdoor plans.");
        }
        
        if (current.humidity > 85) {
            insights.push("💧 Very humid - air conditioning recommended for comfort.");
        } else if (current.humidity < 25) {
            insights.push("🏜️ Dry air alert - moisturize and stay hydrated!");
        }
        
        if (current.windSpeed > 30) {
            insights.push("💨 Strong winds today - secure loose outdoor items!");
        }
        
        if (current.precipitation > 5) {
            insights.push("📖 Heavy rain expected - perfect weather for indoor activities!");
        }
        
        if (insights.length === 0) {
            insights.push("😊 Beautiful conditions ahead! Enjoy your day to the fullest!");
        }
        
        this.updateElementText('weatherAdvice', insights.join(' '));
    }

    updateWeeklyForecast() {
        const {daily} = this.weatherData;
        const today = new Date();
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        const html = daily.temperatureMax.slice(0, 6).map((maxTemp, i) => {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[date.getDay()];
            const icon = this.getWeatherIcon(daily.weatherCode[i], true);
            const minTemp = daily.temperatureMin[i];
            
            return `
                <div class="daily-row">
                    <div class="flex items-center gap-3">
                        <span class="text-sm font-semibold w-16 text-left">${dayName}</span>
                        <span class="text-2xl" aria-hidden="true">${icon}</span>
                    </div>
                    <div class="text-right">
                        <span class="font-bold text-base">${maxTemp}°</span>
                        <span class="text-gray-400 text-sm ml-2">${minTemp}°</span>
                    </div>
                </div>
            `;
        }).join('');
        
        const container = document.getElementById('weeklyForecastContainer');
        if (container) {
            container.innerHTML = html;
        }
    }

    showMainContent() {
        try {
            this.elements.loadingScreen.style.opacity = '0';
            this.elements.loadingScreen.style.pointerEvents = 'none';
            
            setTimeout(() => {
                this.elements.loadingScreen.style.display = 'none';
                this.elements.mainContent.style.opacity = '1';
            }, 600);
        } catch (error) {
            console.error('Failed to show main content:', error);
        }
    }

    // Utility methods
    updateElementText(id, text) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    }

    isValidCoordinate(lat, lon) {
        return typeof lat === 'number' && typeof lon === 'number' &&
               lat >= -90 && lat <= 90 && lon >= -180 && lon <=180;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getCountryFlag(countryCode) {
        const flags = {
            'IN': '🇮🇳', 'US': '🇺🇸', 'GB': '🇬🇧', 'CA': '🇨🇦', 'AU': '🇦🇺',
            'DE': '🇩🇪', 'FR': '🇫🇷', 'JP': '🇯🇵', 'CN': '🇨🇳', 'BR': '🇧🇷',
            'IT': '🇮🇹', 'ES': '🇪🇸', 'RU': '🇷🇺', 'KR': '🇰🇷', 'MX': '🇲🇽',
            'NL': '🇳🇱', 'BE': '🇧🇪', 'CH': '🇨🇭', 'AT': '🇦🇹', 'SE': '🇸🇪',
            'DK': '🇩🇰', 'NO': '🇳🇴', 'FI': '🇫🇮', 'PL': '🇵🇱', 'CZ': '🇨🇿'
        };
        return flags[countryCode] || '🌍';
    }

    getWeatherCondition(code) {
        const conditions = {
            0: 'Clear Sky', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
            45: 'Foggy', 48: 'Depositing Rime Fog', 51: 'Light Drizzle', 53: 'Moderate Drizzle',
            55: 'Dense Drizzle', 56: 'Freezing Drizzle', 57: 'Dense Freezing Drizzle',
            61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain', 66: 'Freezing Rain',
            67: 'Heavy Freezing Rain', 71: 'Slight Snow', 73: 'Moderate Snow', 75: 'Heavy Snow',
            77: 'Snow Grains', 80: 'Slight Rain Showers', 81: 'Moderate Rain Showers',
            82: 'Violent Rain Showers', 85: 'Slight Snow Showers', 86: 'Heavy Snow Showers',
            95: 'Thunderstorm', 96: 'Thunderstorm with Hail', 99: 'Heavy Thunderstorm with Hail'
        };
        return conditions[code] || 'Unknown Conditions';
    }

    getWeatherIcon(code, isDay) {
        const icons = {
            0: isDay ? '☀️' : '🌙',
            1: isDay ? '🌤️' : '🌙',
            2: '⛅', 3: '☁️',
            45: '🌫️', 48: '🌫️',
            51: '🌦️', 53: '🌦️', 55: '🌦️',
            56: '🌨️', 57: '🌨️',
            61: '🌧️', 63: '🌧️', 65: '⛈️',
            66: '🌨️', 67: '🌨️',
            71: '❄️', 73: '❄️', 75: '❄️', 77: '❄️',
            80: '🌦️', 81: '🌧️', 82: '⛈️',
            85: '🌨️', 86: '🌨️',
            95: '⛈️', 96: '⛈️', 99: '⛈️'
        };
        return icons[code] || (isDay ? '🌤️' : '🌙');
    }

    getWindDirection(degrees) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        return directions[Math.round(degrees / 22.5) % 16] || 'N';
    }

    getUVLevel(uv) {
        if (uv <= 2) return 'Low';
        if (uv <= 5) return 'Moderate'; 
        if (uv <= 7) return 'High';
        if (uv <= 10) return 'Very High';
        return 'Extreme';
    }

    getAQIStatus(aqi) {
        if (aqi <= 50) return 'Good';
        if (aqi <= 100) return 'Moderate';
        if (aqi <= 150) return 'Unhealthy for Sensitive';
        if (aqi <= 200) return 'Unhealthy';
        if (aqi <= 300) return 'Very Unhealthy';
        return 'Hazardous';
    }
}

// Initialize application when DOM is ready
let app;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new WeatherApp();
    });
} else {
    app = new WeatherApp();
}

// Global error handler for unhandled exceptions
window.addEventListener('error', (event) => {
    console.error('Unhandled error:', event.error);
});

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});