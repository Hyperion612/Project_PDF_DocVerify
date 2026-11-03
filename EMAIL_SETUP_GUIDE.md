# 📧 Настройка приёма писем на сайте

## 🎯 Вариант 1: Web3Forms (РЕКОМЕНДУЮ)

### Шаг 1: Получите Access Key

1. Откройте https://web3forms.com
2. Введите ваш email (например: `your-email@gmail.com`)
3. Нажмите **"Create Access Key"**
4. Проверьте почту и подтвердите email
5. Скопируйте **Access Key** (выглядит как: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### Шаг 2: Вставьте ключ в код

Откройте файл `src/pages/ContactPage.tsx` и найдите строку 4:

```typescript
const WEB3FORMS_ACCESS_KEY = 'YOUR_ACCESS_KEY_HERE';
```

Замените на ваш ключ:

```typescript
const WEB3FORMS_ACCESS_KEY = 'ваш-реальный-ключ-тут';
```

### Шаг 3: Отправьте изменения на GitHub

```bash
git add .
git commit -m "Настройка формы обратной связи"
git push
```

### Шаг 4: Проверьте работу

1. Откройте ваш сайт
2. Перейдите на страницу "Контакты"
3. Заполните форму и отправьте
4. Письмо придёт на ваш email!

---

## 🎯 Вариант 2: Formspree (альтернатива)

Если не хотите использовать Web3Forms:

### Шаг 1: Регистрация

1. Откройте https://formspree.io
2. Зарегистрируйтесь через GitHub или email
3. Создайте новую форму
4. Скопируйте **Endpoint URL** (например: `https://formspree.io/f/xyzabcde`)

### Шаг 2: Измените код

В `src/pages/ContactPage.tsx` замените функцию `handleSubmit`:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;

  setFormState('sending');
  setErrorMessage('');

  try {
    const response = await fetch('https://formspree.io/f/ВАШ_ID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'Новое сообщение с DocVerify',
        message: formData.message,
      }),
    });

    if (response.ok) {
      setFormState('sent');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      throw new Error('Ошибка отправки');
    }
  } catch (error: any) {
    setFormState('error');
    setErrorMessage(error.message || 'Не удалось отправить сообщение');
  }
};
```

---

## 🎯 Вариант 3: EmailJS (для продвинутых)

Если хотите больше контроля:

### Шаг 1: Регистрация

1. Откройте https://www.emailjs.com
2. Зарегистрируйтесь
3. Добавьте Email Service (Gmail, Outlook и т.д.)
4. Создайте Email Template
5. Скопируйте:
   - **Service ID**
   - **Template ID**
   - **Public Key**

### Шаг 2: Установка

```bash
npm install @emailjs/browser
```

### Шаг 3: Измените код

В `src/pages/ContactPage.tsx`:

```typescript
import emailjs from '@emailjs/browser';

// В начале файла
const EMAILJS_SERVICE_ID = 'ваш_service_id';
const EMAILJS_TEMPLATE_ID = 'ваш_template_id';
const EMAILJS_PUBLIC_KEY = 'ваш_public_key';

// В функции handleSubmit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;

  setFormState('sending');

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
      },
      EMAILJS_PUBLIC_KEY
    );

    setFormState('sent');
    setFormData({ name: '', email: '', subject: '', message: '' });
  } catch (error) {
    setFormState('error');
    setErrorMessage('Ошибка отправки');
  }
};
```

---

## 🎯 Вариант 4: Кастомный домен (продвинутый)

Если хотите почту вида `hello@docverify.com`:

### Шаг 1: Купите домен

- Namecheap: https://www.namecheap.com
- GoDaddy: https://www.godaddy.com
- Google Domains: https://domains.google

### Шаг 2: Настройте email forwarding

**Бесплатные сервисы:**

1. **ImprovMX** (https://improvmx.com)
   - Бесплатно до 100 писем/день
   - Перенаправляет на ваш Gmail
   
2. **Forwardemail** (https://forwardemail.net)
   - Бесплатно до 100 писем/день
   - Open source

3. **Cloudflare Email Routing** (если домен на Cloudflare)
   - Полностью бесплатно
   - Неограниченно

### Шаг 3: Настройка DNS

Добавьте MX записи у вашего регистратора домена:

**Для ImprovMX:**
```
MX @ mx1.improvmx.com (Priority: 10)
MX @ mx2.improvmx.com (Priority: 20)
```

**Для Forwardemail:**
```
MX @ mx1.forwardemail.net (Priority: 10)
MX @ mx2.forwardemail.net (Priority: 20)
```

### Шаг 4: Верификация

Подтвердите домен в панели управления сервисом.

---

## 📊 Сравнение вариантов

| Сервис | Бесплатно | Лимит | Сложность |
|--------|-----------|-------|-----------|
| **Web3Forms** | ✅ Да | 250 писем/мес | ⭐ Легко |
| **Formspree** | ✅ Да | 50 писем/мес | ⭐ Легко |
| **EmailJS** | ✅ Да | 200 писем/мес | ⭐⭐ Средне |
| **Кастомный домен** | ⚠️ Зависит | Без лимита | ⭐⭐⭐ Сложно |

---

## ✅ Быстрый старт (Web3Forms)

```bash
# 1. Получите ключ на https://web3forms.com
# 2. Откройте src/pages/ContactPage.tsx
# 3. Замените строку 4:
const WEB3FORMS_ACCESS_KEY = 'ваш-ключ-тут';

# 4. Отправьте на GitHub
git add src/pages/ContactPage.tsx
git commit -m "Настройка формы обратной связи"
git push

# 5. Готово! Письма будут приходить на ваш email
```

---

## 🔒 Безопасность

Все сервисы (Web3Forms, Formspree, EmailJS):
- ✅ Шифруют данные
- ✅ Защищают от спама (reCAPTCHA)
- ✅ Не хранят данные долго
- ✅ Соответствуют GDPR

---

## 🆘 Решение проблем

### Письма не приходят

1. Проверьте папку "Спам"
2. Убедитесь, что Access Key правильный
3. Проверьте консоль браузера (F12) на ошибки
4. Убедитесь, что email подтверждён в сервисе

### Ошибка "Access Key invalid"

- Скопируйте ключ заново с сайта сервиса
- Убедитесь, что нет лишних пробелов
- Проверьте, что email подтверждён

### Форма не отправляется

- Откройте консоль браузера (F12)
- Проверьте вкладку "Network"
- Убедитесь, что запрос уходит на правильный URL

---

## 📞 Поддержка

- **Web3Forms**: https://web3forms.com/#faq
- **Formspree**: https://formspree.io/share
- **EmailJS**: https://support.emailjs.com

---

**Рекомендация:** Начните с **Web3Forms** — это самый простой и надёжный вариант для статического сайта на GitHub Pages.
