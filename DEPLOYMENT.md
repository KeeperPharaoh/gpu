# Инструкции по развертыванию

## Локальная разработка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd gpu
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите сервер разработки:
```bash
npm run dev
```

4. Откройте браузер и перейдите по адресу:
   ```
   http://localhost:5173/?chat_id=123456789
   ```

## Продакшн сборка

1. Соберите проект:
```bash
npm run build
```

2. Содержимое папки `dist/` готово для развертывания

## Развертывание на статическом хостинге

### Netlify
1. Загрузите содержимое папки `dist/` в Netlify
2. Настройте redirects для SPA:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Vercel
1. Подключите репозиторий к Vercel
2. Vercel автоматически определит настройки Vite
3. Настройте переменные окружения при необходимости

### GitHub Pages
1. Создайте GitHub Actions workflow:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Развертывание на сервере

### Nginx
1. Загрузите содержимое `dist/` в `/var/www/gpu/`
2. Настройте Nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/gpu;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /stage-tlg-reg/ {
        alias /var/www/gpu/;
        try_files $uri $uri/ /index.html;
    }
}
```

### Apache
1. Загрузите содержимое `dist/` в папку веб-сервера
2. Создайте `.htaccess`:
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## Настройка Telegram Web App

1. Создайте бота через @BotFather
2. Настройте Web App:
```
/setmenubutton
```

3. Укажите URL вашего приложения:
```
https://your-domain.com/?chat_id={chat_id}
```

## Проверка развертывания

1. Проверьте доступность приложения:
```bash
curl -I https://your-domain.com/?chat_id=123456789
```

2. Проверьте работу API:
```bash
curl -X POST http://platform.astanahubcloud.com/telegram/resources/create/end \
  -H "Content-Type: application/json" \
  -d '{"chat_id":"123456789","resourse_id":12,"resourse":{"description":"test"}}'
```

## Мониторинг

### Логи
Настройте логирование для отслеживания ошибок:
- Ошибки JavaScript в консоли браузера
- Ошибки сети в Network tab
- Ошибки API в логах сервера

### Метрики
Отслеживайте:
- Количество заявок
- Время загрузки страницы
- Ошибки валидации
- Успешность отправки заявок

## Безопасность

1. Настройте HTTPS
2. Добавьте CSP заголовки:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://telegram.org; style-src 'self' 'unsafe-inline';
```

3. Настройте CORS для API:
```
Access-Control-Allow-Origin: https://your-domain.com
```

## Обновления

1. Соберите новую версию:
```bash
npm run build
```

2. Замените содержимое папки `dist/` на сервере

3. Очистите кэш браузера при необходимости

## Резервное копирование

1. Регулярно создавайте резервные копии:
```bash
tar -czf backup-$(date +%Y%m%d).tar.gz dist/
```

2. Храните резервные копии в безопасном месте

## Поддержка

При возникновении проблем:
1. Проверьте логи сервера
2. Проверьте консоль браузера
3. Убедитесь в корректности URL параметров
4. Проверьте доступность API endpoint 