// счетчик для виджетов
let widgetCount = 0;

// получаем форму и контейнер для виджетов
const weatherForm = document.getElementById('weatherForm');
const widgetsContainer = document.getElementById('widgetsContainer');

// основной обработчик формы
weatherForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // получаем значения из полей ввода
    const latitudeInput = document.getElementById('latitude'); 
    const longitudeInput = document.getElementById('longitude');
    const latitude = latitudeInput.value.trim();
    const longitude = longitudeInput.value.trim();
    
    // элементы для отображения ошибок
    const latitudeError = document.getElementById('latitudeError');
    const longitudeError = document.getElementById('longitudeError');
    
    let isValid = true;
    
    // валидация широты
    const latitudeNum = parseFloat(latitude);
    if (isNaN(latitudeNum) || latitudeNum < -90 || latitudeNum > 90) {
        latitudeError.textContent = 'Неправильная широта, введите от -90 до 90';
        latitudeInput.classList.add('error');
        isValid = false;
    } else {
        latitudeError.textContent = '';
        latitudeInput.classList.remove('error');
    }
    
    // валидация долготы
    const longitudeNum = parseFloat(longitude);
    if (isNaN(longitudeNum) || longitudeNum < -180 || longitudeNum > 180) {
        longitudeError.textContent = 'Неправильная долгота, введите от -180 до 180';
        longitudeInput.classList.add('error');
        isValid = false;
    } else {
        longitudeError.textContent = '';
        longitudeInput.classList.remove('error');
    }
    
    // если валидация прошла успешно, получаем погоду
    if (isValid) {
        getWeather(latitude, longitude);
        weatherForm.reset();
    }
});

// функция для получения данных о погоде
async function getWeather(latitude, longitude) {
    // создаем уникальный ID для виджета
    const widgetId = 'widget-' + widgetCount;
    widgetCount++;
    
    // показываем виджет загрузки
    const loadingWidget = document.createElement('div');
    loadingWidget.id = widgetId;
    loadingWidget.className = 'weather-widget loading';
    loadingWidget.textContent = '...';
    widgetsContainer.appendChild(loadingWidget);
    
    try {
        // формируем URL для запроса к API
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&current=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code&timezone=auto';
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('проблема с АПИ');
        }
        
        const data = await response.json();
        
        // извлекаем данные о текущей погоде
        const current = data.current;
        const temperature = Math.round(current.temperature_2m);
        const windSpeed = current.wind_speed_10m;
        const windDirection = current.wind_direction_10m;
        const weatherCode = current.weather_code;
        
        // получаем иконку, описание и направление ветра
        const icon = getIcon(weatherCode);
        const description = getDescription(weatherCode);
        const windDirectionText = getWindDirection(windDirection);
        
        // получаем текущее время
        const currentTime = new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
        
        // получаем шаблон из HTML
        const template = document.getElementById('weatherWidgetTemplate');
        const widget = template.content.cloneNode(true);
        
        // устанавливаем ID для виджета
        const widgetElement = widget.querySelector('.weather-widget');
        widgetElement.id = widgetId;
        
        // заполняем виджет данными
        widget.querySelector('.widget-title').textContent = `Погода здесь (${latitude}, ${longitude})`;
        widget.querySelector('.weather-icon').textContent = icon;
        widget.querySelector('.temperature').textContent = temperature + 'ºC';
        widget.querySelector('.weather-description').textContent = description;
        widget.querySelector('.wind-speed').textContent = windSpeed + ' км/ч';
        widget.querySelector('.wind-direction').textContent = windDirectionText;
        widget.querySelector('.current-time').textContent = currentTime;
        
        // настраиваем карту
        const mapIframe = widget.querySelector('.map-iframe');
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        mapIframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.1},${lat-0.1},${lon+0.1},${lat+0.1}&layer=mapnik&marker=${lat},${lon}`;
        
        // настраиваем кнопку удаления
        const removeButton = widget.querySelector('.btn-remove');
        removeButton.onclick = function() {
            widgetElement.remove();
        };
        
        // заменяем виджет загрузки на виджет с данными
        loadingWidget.replaceWith(widget);
        
    } catch (error) {
        // обработка ошибок
        loadingWidget.className = 'weather-widget error-widget';
        loadingWidget.textContent = 'ОШИБКА: ' + error.message;
    }
}

// функция для получения направления ветра как текст
function getWindDirection(degrees) {
    const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index] + ' (' + degrees + '°)';
}

// функция для получения смайлика погоды по коду
function getIcon(code) {
    if (code === 0) return '☀️';
    if (code === 1 || code === 2) return '🌤️';
    if (code === 3) return '☁️';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 55) return '🌦️';
    if (code >= 61 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌧️';
    if (code >= 85 && code <= 86) return '❄️';
    if (code >= 95 && code <= 99) return '⛈️';
    return '🌤️';
}

// функция для получения описания погоды по коду
function getDescription(code) {
    if (code === 0) return 'Ясно';
    if (code === 1) return 'Преимущественно ясно';
    if (code === 2) return 'Переменная облачность';
    if (code === 3) return 'Пасмурно';
    if (code >= 45 && code <= 48) return 'Туман';
    if (code >= 51 && code <= 55) return 'Морось';
    if (code >= 61 && code <= 67) return 'Дождь';
    if (code >= 71 && code <= 77) return 'Снег';
    if (code >= 80 && code <= 82) return 'Ливень';
    if (code >= 85 && code <= 86) return 'Снегопад';
    if (code >= 95 && code <= 99) return 'Гроза';
    return 'Неизвестно';
}
