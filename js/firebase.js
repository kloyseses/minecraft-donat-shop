// Ваши конфигурационные данные из Firebase Console
const firebaseConfig = {
    apiKey: "ВАШ_API_KEY",
    authDomain: "ВАШ_PROJECT_ID.firebaseapp.com",
    projectId: "ВАШ_PROJECT_ID",
    storageBucket: "ВАШ_PROJECT_ID.appspot.com",
    messagingSenderId: "ВАШ_SENDER_ID",
    appId: "ВАШ_APP_ID"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);

// Инициализация сервисов
const auth = firebase.auth();
const db = firebase.firestore();

// Для использования в других файлах
function getDb() {
    return db;
}

function getAuth() {
    return auth;
}