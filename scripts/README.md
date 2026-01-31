# Скриптове за управление на админи

## Как да добавиш admin права

### Стъпка 1: Изтегли Service Account Key

1. Отиди в [Firebase Console](https://console.firebase.google.com/)
2. Избери проекта `yoga-vibe-4bdc3`
3. Отиди на **Project Settings** (⚙️) > **Service Accounts**
4. Кликни на **Generate New Private Key**
5. Запази файла като `serviceAccountKey.json` в папката `react-admin/`
6. ⚠️ **ВАЖНО**: Файлът вече е добавен в `.gitignore` (не го комитирай!)

### Стъпка 2: Инсталирай Firebase Admin SDK

```bash
cd react-admin
npm install firebase-admin
```

### Стъпка 3: Създай потребител (ако нямаш)

1. Отиди в Firebase Console > **Authentication** > **Users**
2. Кликни **Add User**
3. Въведи email и парола
4. Запази email-а

### Стъпка 4: Стартирай скрипта

#### Добави admin права:
```bash
node scripts/addAdmin.js add <email>
```

Пример:
```bash
node scripts/addAdmin.js add admin@example.com
```

#### Премахни admin права:
```bash
node scripts/addAdmin.js remove <email>
```

#### Покажи всички админи:
```bash
node scripts/addAdmin.js list
```

### Стъпка 5: Тествай

1. Отвори admin панела
2. **Излез** от акаунта (ако си влязъл)
3. **Влез отново** с admin email и парола
4. Трябва да имаш достъп до всички страници

---

## Структура на файловете

```
react-admin/
├── scripts/
│   ├── addAdmin.js      # Главен скрипт
│   └── README.md        # Тази документация
├── serviceAccountKey.json  # ⚠️ Секретен файл (не комитирай!)
└── .gitignore          # Вече включва serviceAccountKey.json
```

---

## Безопасност

⚠️ **ВАЖНО**: 
- Никога не комитирай `serviceAccountKey.json` в Git!
- Файлът вече е добавен в `.gitignore`
- Ако случайно го комитираш, веднага го изтрий от Firebase Console и генерирай нов

---

## Отстраняване на проблеми

### Грешка: "serviceAccountKey.json не е намерен"
- Увери се, че файлът е в папката `react-admin/`
- Провери дали името е точно `serviceAccountKey.json` (без допълнителни символи)

### Грешка: "Потребител не съществува"
- Създай първо потребителя в Firebase Console > Authentication > Users

### Грешка: "Cannot find module 'firebase-admin'"
- Инсталирай зависимостите: `npm install firebase-admin`

---

## Допълнителна информация

За повече информация виж:
- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Custom Claims Documentation](https://firebase.google.com/docs/auth/admin/custom-claims)

