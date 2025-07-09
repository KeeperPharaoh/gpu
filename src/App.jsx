import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
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
      const response = await axios.post('https://platform.astanahubcloud.com/telegram/resources/create/end', {
        chat_id: chatId,
        resource_id: "create-resource_12",
        resource: {
          description: description.trim()
        }
      })

      if (response.status === 200) {
        setSuccess('Заявка успешно отправлена!')
        setDescription('')
        if (window.Telegram && window.Telegram.WebApp && typeof window.Telegram.WebApp.close === 'function') {
          window.Telegram.WebApp.close()
        }
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
      <div className="container gpu-form-container">
        <h1 className="title gpu-title">Заявка на GPU</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="description" className="form-label gpu-label">
              Опишите ваш проект и укажите, сколько видеокарт H100 или H200 вам нужно
            </label>
            <textarea
              id="description"
              className="form-textarea gpu-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Например: Для обучения моей нейросети требуется 2x H100"
              disabled={isLoading}
            />
          </div>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <button 
            type="submit" 
            className="btn gpu-btn"
            disabled={isLoading || !description.trim()}
          >
            {isLoading ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default App 