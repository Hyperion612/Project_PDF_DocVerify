# Инструкция по настройке GitHub Actions и деплою

## 📋 Что уже настроено

✅ **GitHub Actions workflow** (`.github/workflows/deploy.yml`)
- Автоматический деплой при push в ветку `main`
- Возможность ручного запуска из вкладки Actions
- Использование Node.js 20
- Кэширование npm зависимостей для ускорения сборки

✅ **Vite конфигурация** (`vite.config.js`)
- Настроен `base: './'` для корректной работы с GitHub Pages
- Выходная директория: `dist`

✅ **HashRouter** в `App.tsx`
- Используется вместо BrowserRouter для корректной работы маршрутизации на GitHub Pages

## 🚀 Пошаговая инструкция по деплою

### Шаг 1: Создайте репозиторий на GitHub

1. Перейдите на [github.com](https://github.com)
2. Нажмите **"New repository"** (зелёная кнопка)
3. Заполните:
   - **Repository name**: `docverify` (или любое другое имя)
   - **Description**: "Обнаружение поддельных документов на базе ИИ"
   - **Public** (обязательно для бесплатного GitHub Pages)
   - **НЕ ставьте галочку** "Add a README file" (мы уже создали свой)
4. Нажмите **"Create repository"**

### Шаг 2: Загрузите код в репозиторий

#### Вариант А: Через GitHub Desktop (рекомендуется)

1. Откройте **GitHub Desktop**
2. Нажмите **"Add"** → **"Existing Repository"**
3. Выберите папку с проектом
4. Нажмите **"Publish repository"**
5. Выберите ваш репозиторий `docverify`
6. Нажмите **"Publish"**

#### Вариант Б: Через командную строку

```bash
# Перейдите в папку проекта
cd D:\DocVerify

# Инициализируйте Git (если ещё не инициализирован)
git init

# Добавьте все файлы
git add .

# Создайте первый коммит
git commit -m "Initial commit: DocVerify project"

# Добавьте удалённый репозиторий (замените ВАШ_ЛОГИН на ваш логин GitHub)
git remote add origin https://github.com/ВАШ_ЛОГИН/docverify.git

# Отправьте код в main ветку
git branch -M main
git push -u origin main
```

#### Вариант В: Через VS Code

1. Откройте проект в VS Code
2. Нажмите на иконку **Source Control** (слева)
3. Нажмите **"..."** → **"Publish to GitHub"**
4. Выберите **"Publish to public repository"**
5. Введите имя репозитория: `docverify`
6. Нажмите **Enter**

### Шаг 3: Настройте GitHub Pages

1. Перейдите в ваш репозиторий на GitHub
2. Нажмите **Settings** (вкладки вверху)
3. В левом меню выберите **Pages**
4. В разделе **Build and deployment**:
   - **Source**: выберите **GitHub Actions**
5. GitHub автоматически найдёт файл `.github/workflows/deploy.yml`

### Шаг 4: Дождитесь завершения деплоя

1. Перейдите в вкладку **Actions** в вашем репозитории
2. Вы увидите запущенный workflow **"Deploy to GitHub Pages"**
3. Дождитесь завершения (обычно 2-3 минуты)
4. Когда появится зелёная галочка ✅ — деплой завершён

### Шаг 5: Откройте ваш сайт

Ваш сайт будет доступен по адресу:
```
https://ВАШ_ЛОГИН.github.io/docverify/
```

Например:
- Если ваш логин: `johnsmith`
- Имя репозитория: `docverify`
- URL: `https://johnsmith.github.io/docverify/`

## 🔄 Как обновлять сайт

Просто внесите изменения в код и отправьте их в ветку `main`:

```bash
# Внесите изменения в файлы
# ...

# Добавьте изменения
git add .

# Создайте коммит
git commit -m "Update: описание изменений"

# Отправьте в GitHub
git push
```

GitHub Actions автоматически пересоберёт и задеплоит сайт!

## 🛠️ Ручной запуск деплоя

Если хотите запустить деплой вручную (без push):

1. Перейдите в вкладку **Actions** в вашем репозитории
2. Выберите workflow **"Deploy to GitHub Pages"** (слева)
3. Нажмите **"Run workflow"** (справа)
4. Выберите ветку `main`
5. Нажмите **"Run workflow"**

## ❓ Решение проблем

### Проблема: Сайт не открывается (404)

**Решение:**
1. Убедитесь, что GitHub Pages включён (Settings → Pages)
2. Проверьте, что выбран источник **GitHub Actions**
3. Дождитесь завершения workflow в вкладке Actions
4. Подождите 5-10 минут (GitHub Pages может кэшировать)

### Проблема: Белый экран или ошибки

**Решение:**
1. Откройте консоль браузера (F12)
2. Проверьте, что `base: './'` установлен в `vite.config.js`
3. Убедитесь, что используется `HashRouter` в `App.tsx`
4. Пересоберите проект: `npm run build`

### Проблема: Workflow не запускается

**Решение:**
1. Проверьте, что файл `.github/workflows/deploy.yml` существует
2. Убедитесь, что вы запушили в ветку `main`
3. Проверьте вкладку Actions для просмотра логов ошибок

### Проблема: Старая версия сайта отображается

**Решение:**
1. Очистите кэш браузера (Ctrl + Shift + Delete)
2. Или откройте в режиме инкогнито
3. Подождите 5-10 минут (GitHub Pages кэширует)

## 📊 Мониторинг деплоя

Чтобы проверить статус деплоя:

1. **Вкладка Actions**: показывает все запуски workflow
2. **Settings → Pages**: показывает URL и статус деплоя
3. **Commits**: показывает, какие коммиты были задеплоены

## 🔧 Дополнительные настройки

### Изменить имя репозитория

Если хотите изменить имя репозитория:

1. Settings → Repository name → измените имя
2. GitHub Pages автоматически обновит URL
3. Новый URL: `https://ВАШ_ЛОГИН.github.io/НОВОЕ_ИМЯ/`

### Добавить кастомный домен

Если хотите использовать свой домен (например, `docverify.com`):

1. Settings → Pages → Custom domain
2. Введите ваш домен
3. Настройте DNS у вашего регистратора
4. Подробнее: [GitHub Docs - Custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

### Отключить автоматический деплой

Если хотите отключить автоматический деплой:

1. Удалите файл `.github/workflows/deploy.yml`
2. Или переименуйте его в `.github/workflows/deploy.yml.disabled`

## 📚 Полезные ссылки

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)

## 🎉 Готово!

Теперь ваш сайт автоматически деплоится на GitHub Pages при каждом push в ветку `main`. 

Удачи с проектом! 🚀
