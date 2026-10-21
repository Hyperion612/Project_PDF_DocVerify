# 🚀 Быстрый старт: GitHub Actions + GitHub Pages

## ✅ Что уже готово

Ваш проект полностью настроен для автоматического деплоя!

### Созданные файлы:

1. **`.github/workflows/deploy.yml`** - GitHub Actions workflow
2. **`vite.config.js`** - настроен для GitHub Pages (`base: './'`)
3. **`README.md`** - описание проекта
4. **`DEPLOY_GUIDE.md`** - подробная инструкция
5. **`GIT_CHEATSHEET.md`** - шпаргалка по Git
6. **`.gitignore`** - исключения для Git

## 📦 Как задеплоить за 5 минут

### 1️⃣ Создайте репозиторий на GitHub

- Перейдите на [github.com/new](https://github.com/new)
- Имя: `docverify`
- Public (обязательно!)
- **НЕ** создавайте README (он уже есть)

### 2️⃣ Загрузите код

Откройте PowerShell в папке проекта и выполните:

```powershell
cd D:\DocVerify

# Инициализация Git
git init
git add .
git commit -m "Initial commit: DocVerify with GitHub Actions"

# Подключите репозиторий (замените ВАШ_ЛОГИН)
git remote add origin https://github.com/ВАШ_ЛОГИН/docverify.git
git branch -M main
git push -u origin main
```

### 3️⃣ Включите GitHub Pages

1. Откройте репозиторий на GitHub
2. **Settings** → **Pages**
3. **Source**: выберите **GitHub Actions**
4. Готово!

### 4️⃣ Дождитесь деплоя

- Перейдите во вкладку **Actions**
- Дождитесь зелёной галочки ✅ (2-3 минуты)
- Откройте сайт: `https://ВАШ_ЛОГИН.github.io/docverify/`

## 🔄 Как обновлять сайт

Просто коммитьте и пушьте изменения:

```powershell
git add .
git commit -m "Update: описание изменений"
git push
```

GitHub Actions автоматически пересоберёт и задеплоит сайт!

## 📚 Документация

- **README.md** - описание проекта
- **DEPLOY_GUIDE.md** - подробная инструкция по деплою
- **GIT_CHEATSHEET.md** - шпаргалка по Git командам

## ❓ Частые вопросы

**Q: Где мой сайт?**  
A: `https://ВАШ_ЛОГИН.github.io/docverify/`

**Q: Как проверить статус деплоя?**  
A: Вкладка **Actions** в репозитории

**Q: Как запустить деплой вручную?**  
A: Actions → Deploy to GitHub Pages → Run workflow

**Q: Сайт не открывается?**  
A: Подождите 5-10 минут, GitHub Pages кэширует

## 🎉 Готово!

Ваш сайт теперь автоматически деплоится при каждом push в ветку `main`!

---

**Нужна помощь?**  
📖 Прочитайте [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) для подробных инструкций  
📋 Используйте [GIT_CHEATSHEET.md](./GIT_CHEATSHEET.md) для Git команд
