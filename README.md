# Treasure Hunter Game

3D игра на Babylon.js с модульной архитектурой, собранная с помощью Vite.

## Установка

```bash
npm install
```

## Запуск

### Режим разработки

```bash
npm run dev
```

### Сборка для продакшена

```bash
npm run build
```

### Просмотр собранной версии

```bash
npm run preview
```

## Линтинг и форматирование

### Проверка кода линтером

```bash
npm run lint
```

### Форматирование кода

```bash
npm run format
```

### Проверка форматирования

```bash
npm run format:check
```

## Структура проекта

```
├── src/
│   ├── config/          # Константы и конфигурация
│   ├── game/            # Игровая логика
│   │   ├── audio.js      # Управление звуками
│   │   ├── buildings.js  # Создание зданий
│   │   ├── camera.js     # Камера
│   │   ├── engine.js     # Движок Babylon.js
│   │   ├── environment.js # Окружение (небо, вода, земля)
│   │   ├── game.js       # Основная логика игры
│   │   ├── guard.js      # Стражи
│   │   ├── lighting.js   # Освещение
│   │   ├── player.js     # Игрок
│   │   ├── scene.js      # Сцена
│   │   ├── timer.js      # Таймер
│   │   └── treasure.js   # Сокровища
│   ├── ui/               # UI элементы
│   └── main.js           # Точка входа
├── public/               # Статические файлы
│   ├── audio/            # Звуковые файлы
│   ├── img/              # Изображения
│   └── *.gltf            # 3D модели
└── index.html            # HTML файл

```

## Технологии

- **Vite** - сборщик и dev-сервер
- **Babylon.js** - 3D движок
- **ESLint** - линтер
- **Prettier** - форматирование кода

## Управление

- **WASD** - движение
- **Shift** - бег
- **Shift+Ctrl+Alt+I** - открыть/закрыть инспектор Babylon.js
