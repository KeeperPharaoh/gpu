# Инструкции по интеграции

## Использование

Приложение отображает форму заявки сразу при открытии страницы. Используйте URL с параметром `chat_id`:

```
https://your-domain.com/?chat_id=123456789
```

## Интеграция в существующий проект

### Шаг 1: Установка зависимостей
```bash
npm install axios
```

### Шаг 2: Копирование компонентов
Скопируйте следующие файлы в ваш проект:
- `src/App.jsx` - основной компонент с формой
- `src/App.css` - стили приложения
- `src/index.css` - глобальные стили (если нужны)

### Шаг 3: Использование в компоненте
```jsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'

function GPUApplicationForm() {
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [chatId, setChatId] = useState('')

  useEffect(() => {
    // Получаем chat_id из URL параметров
    const urlParams = new URLSearchParams(window.location.search)
    const chatIdFromUrl = urlParams.get('chat_id')
    if (chatIdFromUrl) {
      setChatId(chatIdFromUrl)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!description.trim()) {
      setError('Пожалуйста, заполните описание проекта')
      return
    }

    if (!chatId) {
      setError('Ошибка: не удалось получить chat_id')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await axios.post('http://platform.astanahubcloud.com/telegram/resources/create/end', {
        chat_id: chatId,
        resourse_id: 12,
        resourse: {
          description: description.trim()
        }
      })

      if (response.status === 200) {
        setSuccess('Заявка успешно отправлена!')
        setDescription('')
      } else {
        setError('Ошибка при отправке заявки')
      }
    } catch (err) {
      console.error('Ошибка при отправке заявки:', err)
      setError('Ошибка при отправке заявки. Попробуйте еще раз.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="tg-app">
      <div className="container">
        <h1 className="title">Заявка на GPU</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Подробно опишите проект, на котором вы хотите использовать GPU. Также укажите количество видеокарт H100 или H200, которые вам необходимы.
            </label>
            <textarea
              id="description"
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите ваш проект и укажите необходимое количество видеокарт..."
              disabled={isLoading}
            />
          </div>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <button 
            type="submit" 
            className="btn"
            disabled={isLoading || !description.trim()}
          >
            {isLoading ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default GPUApplicationForm
```

## API Endpoint

Компонент отправляет данные на следующий endpoint:

```
POST http://platform.astanahubcloud.com/telegram/resources/create/end
```

### Структура запроса:
```json
{
  "chat_id": "123456789",
  "resourse_id": 12,
  "resourse": {
    "description": "Описание проекта и количество видеокарт"
  }
}
```

## Стилизация

Компонент использует CSS переменные Telegram Web App для автоматической адаптации под тему пользователя:

- `--tg-theme-bg-color` - цвет фона
- `--tg-theme-text-color` - цвет текста
- `--tg-theme-button-color` - цвет кнопок
- `--tg-theme-button-text-color` - цвет текста кнопок
- `--tg-theme-hint-color` - цвет подсказок

## Кастомизация

### Изменение заголовка
```jsx
<h1 className="title">Ваш заголовок</h1>
```

### Изменение текста кнопки
```jsx
<button type="submit" className="btn">
  Ваш текст кнопки
</button>
```

### Изменение placeholder
```jsx
<textarea
  placeholder="Ваш placeholder..."
/>
```

## Обработка ошибок

Компонент автоматически обрабатывает:
- Валидацию заполнения поля
- Ошибки сети
- Ошибки API
- Отсутствие chat_id

Все ошибки отображаются пользователю в понятном виде.

## Стили

Убедитесь, что в вашем проекте подключены необходимые CSS классы:

```css
.tg-app {
  background: var(--tg-theme-bg-color, #fff);
  color: var(--tg-theme-text-color, #000);
}

.container {
  padding: 16px;
  max-width: 100%;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--tg-theme-hint-color, #ccc);
  border-radius: 8px;
  font-size: 16px;
  min-height: 120px;
  resize: vertical;
}

.btn {
  width: 100%;
  padding: 12px 24px;
  color: var(--tg-theme-button-text-color, #fff);
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

.error {
  color: #ff4444;
  font-size: 14px;
  margin-top: 4px;
}

.success {
  color: #00aa00;
  font-size: 14px;
  margin-top: 4px;
}
``` 