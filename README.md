# Автор: Суханова Софья. Домашнее задание для Artsofte

# Приложение "Погода"

Веб-приложение для просмотра текущей погоды по географическим координатам с отображением карты

## Основные функции

### 1. Ввод и валидация координат

- Широта: от -90 до 90 градусов, долгота: от -180 до 180 градусов
- Валидация с отображением ошибок
- Проверка на корректность числовых значений

### 2. Получение данных о погоде

- Интеграция с Open-Meteo API
- Отображение текущей температуры
- Скорость ветра в км/ч
- Направление ветра
- Код погоды (WMO Weather Interpretation Codes)

### 3. Виджеты

### 4. Интерактивная карта

- Интеграция с OpenStreetMap
- Отображение местоположения по координатам

### 5. Визуальные индикаторы погоды (смайлики)

## Установка и запуск

### Локальный запуск

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd weather_app_artsofte
```

2. Откройте `index.html` в браузере или используйте локальный сервер:
```bash
python -m http.server 8000

npx http-server
```

3. Откройте в браузере: `http://localhost:8000`

### Деплой с Docker и Nginx

1. Соберите Docker образ:
```bash
docker build -t weather-app .
```

2. Запустите контейнер:
```bash
docker run -d -p 80:80 --name weather-app weather-app
```

3. Приложение будет доступно по адресу: `http://localhost`

### Деплой на сервер

1. Скопируйте файлы на сервер:
```bash
scp -r * user@server:/var/www/weather-app/
```

2. Установите Nginx (если не установлен):
```bash
sudo apt-get update
sudo apt-get install nginx
```

3. Скопируйте конфигурацию:
```bash
sudo cp nginx.conf /etc/nginx/sites-available/weather-app
sudo ln -s /etc/nginx/sites-available/weather-app /etc/nginx/sites-enabled/
```

4. Скопируйте файлы приложения:
```bash
sudo cp index.html style.css script.js /usr/share/nginx/html/
```

5. Перезапустите Nginx:
```bash
sudo systemctl restart nginx
```

6. Настройте домен (опционально):
   - Укажите DNS записи на IP вашего сервера
   - Обновите `server_name` в `nginx.conf`