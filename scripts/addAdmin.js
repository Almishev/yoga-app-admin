/**
 * Скрипт за добавяне на admin права към потребител
 * 
 * ИЗПОЛЗВАНЕ:
 * 1. Инсталирай зависимостите: npm install firebase-admin
 * 2. Изтегли serviceAccountKey.json от Firebase Console
 * 3. Стартирай: node scripts/addAdmin.js <email>
 * 
 * ПРИМЕР:
 * node scripts/addAdmin.js admin@example.com
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Проверка за serviceAccountKey.json
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ ГРЕШКА: serviceAccountKey.json не е намерен!');
  console.log('\n📋 ИНСТРУКЦИИ:');
  console.log('1. Отиди в Firebase Console: https://console.firebase.google.com/');
  console.log('2. Избери проекта: yoga-vibe-4bdc3');
  console.log('3. Отиди на Project Settings (⚙️) > Service Accounts');
  console.log('4. Кликни "Generate New Private Key"');
  console.log('5. Запази файла като serviceAccountKey.json в папката react-admin/');
  console.log('6. ⚠️  ВАЖНО: Добави serviceAccountKey.json в .gitignore!');
  process.exit(1);
}

// Зареждане на service account key
const serviceAccount = require(serviceAccountPath);

// Инициализация на Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('✅ Firebase Admin инициализиран успешно\n');
}

/**
 * Добавя admin права на потребител по email
 */
async function addAdminClaim(email) {
  try {
    console.log(`🔍 Търсене на потребител: ${email}...`);
    
    // Намери потребителя по email
    const user = await admin.auth().getUserByEmail(email);
    console.log(`✅ Потребител намерен: ${user.email} (UID: ${user.uid})`);
    
    // Проверка дали вече е админ
    const existingClaims = user.customClaims || {};
    if (existingClaims.admin === true) {
      console.log('⚠️  Потребителят вече има admin права!');
      return;
    }
    
    // Добави admin claim
    console.log('🔐 Добавяне на admin права...');
    await admin.auth().setCustomUserClaims(user.uid, { 
      ...existingClaims,
      admin: true 
    });
    
    console.log(`\n✅ УСПЕХ! Admin права добавени на ${email}`);
    console.log(`   UID: ${user.uid}`);
    console.log('\n⚠️  ВАЖНО: Потребителят трябва да:');
    console.log('   1. Излезе от акаунта си (ако е влязъл)');
    console.log('   2. Влезе отново, за да влязат в сила промените!');
    
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`\n❌ ГРЕШКА: Потребител с email "${email}" не съществува.`);
      console.log('\n💡 Създай първо потребителя в Firebase Console:');
      console.log('   Authentication > Users > Add User');
    } else {
      console.error('\n❌ ГРЕШКА:', error.message);
      console.error('   Код:', error.code);
    }
    process.exit(1);
  }
}

/**
 * Премахва admin права от потребител
 */
async function removeAdminClaim(email) {
  try {
    console.log(`🔍 Търсене на потребител: ${email}...`);
    
    const user = await admin.auth().getUserByEmail(email);
    console.log(`✅ Потребител намерен: ${user.email} (UID: ${user.uid})`);
    
    const existingClaims = user.customClaims || {};
    if (existingClaims.admin !== true) {
      console.log('⚠️  Потребителят няма admin права!');
      return;
    }
    
    // Премахни admin claim
    const { admin, ...restClaims } = existingClaims;
    await admin.auth().setCustomUserClaims(user.uid, restClaims);
    
    console.log(`\n✅ УСПЕХ! Admin права премахнати от ${email}`);
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ГРЕШКА:', error.message);
    process.exit(1);
  }
}

/**
 * Показва списък с всички админи
 */
async function listAdmins() {
  try {
    console.log('🔍 Търсене на всички админи...\n');
    
    const listUsersResult = await admin.auth().listUsers(1000);
    const admins = [];
    
    for (const userRecord of listUsersResult.users) {
      const customClaims = userRecord.customClaims || {};
      if (customClaims.admin === true) {
        admins.push({
          email: userRecord.email,
          uid: userRecord.uid,
          displayName: userRecord.displayName || 'N/A',
        });
      }
    }
    
    if (admins.length === 0) {
      console.log('ℹ️  Няма намерени админи.');
    } else {
      console.log(`✅ Намерени ${admins.length} админ(и):\n`);
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.email}`);
        console.log(`   UID: ${admin.uid}`);
        console.log(`   Име: ${admin.displayName}\n`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ГРЕШКА:', error.message);
    process.exit(1);
  }
}

// Главна логика
const args = process.argv.slice(2);
const command = args[0];
const email = args[1];

if (!command) {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  Firebase Admin Management Script                            ║
╚══════════════════════════════════════════════════════════════╝

ИЗПОЛЗВАНЕ:
  node scripts/addAdmin.js add <email>      - Добави admin права
  node scripts/addAdmin.js remove <email>  - Премахни admin права
  node scripts/addAdmin.js list            - Покажи всички админи

ПРИМЕРИ:
  node scripts/addAdmin.js add admin@example.com
  node scripts/addAdmin.js remove admin@example.com
  node scripts/addAdmin.js list

`);
  process.exit(0);
}

switch (command.toLowerCase()) {
  case 'add':
    if (!email) {
      console.error('❌ Моля, въведи email адрес!');
      console.log('   Пример: node scripts/addAdmin.js add admin@example.com');
      process.exit(1);
    }
    addAdminClaim(email);
    break;
    
  case 'remove':
    if (!email) {
      console.error('❌ Моля, въведи email адрес!');
      console.log('   Пример: node scripts/addAdmin.js remove admin@example.com');
      process.exit(1);
    }
    removeAdminClaim(email);
    break;
    
  case 'list':
    listAdmins();
    break;
    
  default:
    console.error(`❌ Непозната команда: ${command}`);
    console.log('   Използвай: add, remove или list');
    process.exit(1);
}

