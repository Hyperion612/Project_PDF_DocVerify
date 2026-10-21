# Шпаргалка по Git командам

## 🚀 Быстрый старт

```bash
# Инициализация Git в папке проекта
git init

# Добавить все файлы
git add .

# Первый коммит
git commit -m "Initial commit"

# Добавить удалённый репозиторий
git remote add origin https://github.com/ВАШ_ЛОГИН/docverify.git

# Отправить в GitHub
git branch -M main
git push -u origin main
```

## 📝 Ежедневные команды

```bash
# Проверить статус изменений
git status

# Посмотреть изменения
git diff

# Добавить конкретный файл
git add имя_файла

# Добавить все изменённые файлы
git add .

# Создать коммит
git commit -m "Описание изменений"

# Отправить изменения в GitHub
git push

# Получить изменения из GitHub
git pull
```

## 🔍 Полезные команды

```bash
# Посмотреть историю коммитов
git log

# Посмотреть историю (кратко)
git log --oneline

# Посмотреть список веток
git branch

# Создать новую ветку
git branch имя_ветки

# Переключиться на ветку
git checkout имя_ветки

# Создать и переключиться на новую ветку
git checkout -b имя_ветки

# Удалить ветку
git branch -d имя_ветки
```

## ⚠️ Отмена изменений

```bash
# Отменить изменения в файле (до git add)
git checkout -- имя_файла

# Убрать файл из staging area (после git add)
git reset HEAD имя_файла

# Отменить последний коммит (сохранить изменения)
git reset --soft HEAD~1

# Отменить последний коммит (удалить изменения)
git reset --hard HEAD~1

# Отменить все изменения после последнего коммитa
git reset --hard HEAD
```

## 🌿 Работа с ветками

```bash
# Создать ветку для новой функции
git checkout -b feature/название-функции

# Внести изменения и закоммитить
git add .
git commit -m "Add: новая функция"

# Отправить ветку в GitHub
git push -u origin feature/название-функции

# Переключиться на main
git checkout main

# Объединить ветку с main
git merge feature/название-функции

# Отправить объединение в GitHub
git push
```

## 📦 Теги (версии)

```bash
# Создать тег
git tag v1.0.0

# Создать тег с описанием
git tag -a v1.0.0 -m "Первая версия"

# Отправить тег в GitHub
git push origin v1.0.0

# Отправить все теги
git push origin --tags

# Посмотреть список тегов
git tag
```

## 🔧 Конфигурация

```bash
# Установить имя пользователя
git config --global user.name "Ваше Имя"

# Установить email
git config --global user.email "your.email@example.com"

# Посмотреть конфигурацию
git config --list

# Изменить редактор по умолчанию
git config --global core.editor "code --wait"
```

## 🆘 Решение проблем

### Ошибка: "fatal: remote origin already exists"

```bash
# Удалить существующий remote
git remote remove origin

# Добавить заново
git remote add origin https://github.com/ВАШ_ЛОГИН/docverify.git
```

### Ошибка: "Updates were rejected because the remote contains work"

```bash
# Получить изменения из GitHub
git pull origin main

# Если есть конфликты - решить их вручную
# Затем
git add .
git commit -m "Merge remote changes"
git push
```

### Хочу начать заново

```bash
# Удалить Git
rm -rf .git

# Начать заново
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ВАШ_ЛОГИН/docverify.git
git push -u origin main --force
```

## 📊 Статистика

```bash
# Посмотреть статистику коммитов
git shortlog -sn

# Посмотреть кто что изменил
git blame имя_файла

# Посмотреть размер репозитория
git count-objects -vH
```

## 🎯 Лучшие практики

1. **Делайте маленькие коммиты** - один коммит = одна логическая изменения
2. **Пишите понятные сообщения** - используйте префиксы:
   - `Add:` - добавлена новая функция
   - `Fix:` - исправлена ошибка
   - `Update:` - обновлён существующий код
   - `Remove:` - удалён код
   - `Refactor:` - рефакторинг
   - `Docs:` - изменения в документации

3. **Коммитьте часто** - не накапливайте большие изменения
4. **Используйте ветки** - для новых функций создавайте отдельные ветки
5. **Не коммитьте** `node_modules`, `.env`, личные данные

## 🔗 Полезные ссылки

- [Официальная документация Git](https://git-scm.com/doc)
- [Pro Git Book (бесплатная книга)](https://git-scm.com/book/ru/v2)
- [Learn Git Branching (интерактивный туториал)](https://learngitbranching.js.org/?locale=ru_RU)
- [Git Cheat Sheet (PDF)](https://education.github.com/git-cheat-sheet-education.pdf)
