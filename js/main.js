// Получаем ссылки на сервисы Firebase
const db = getDb();
const auth = getAuth();

// Элементы страницы
const categoriesContainer = document.getElementById('categories');
const productsContainer = document.getElementById('products');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');

// Корзина
let cart = [];
let products = [];

// Загрузка категорий и товаров
function loadCategories() {
    db.collection("categories").get().then((querySnapshot) => {
        categoriesContainer.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const category = doc.data();
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category';
            categoryElement.innerHTML = `
                <h3>${category.name}</h3>
                <p>${category.description || ''}</p>
            `;
            categoryElement.onclick = () => filterProducts(doc.id);
            categoriesContainer.appendChild(categoryElement);
        });
    });
}

// Загрузка товаров
function loadProducts() {
    db.collection("products").get().then((querySnapshot) => {
        products = [];
        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });
        displayProducts(products);
    });
}

// Отображение товаров
function displayProducts(productsToShow) {
    productsContainer.innerHTML = '';
    productsToShow.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
            <h4>${product.name}</h4>
            <p>${product.description}</p>
            <div class="price">${product.price} руб</div>
            <button onclick="addToCart('${product.id}')">Купить</button>
        `;
        productsContainer.appendChild(productElement);
    });
}

// Фильтрация товаров по категории
function filterProducts(categoryId) {
    const filtered = products.filter(p => p.category === categoryId);
    displayProducts(filtered);
}

// Работа с корзиной
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCart();
}

function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span>${item.name}</span>
            <span>${item.price} руб</span>
            <button onclick="removeFromCart('${item.id}')">×</button>
        `;
        cartItems.appendChild(cartItem);
        total += item.price;
    });
    
    cartTotal.textContent = `Итого: ${total} руб`;
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        cart.splice(index, 1);
        updateCart();
    }
}

// Оформление заказа
function checkout() {
    if (cart.length === 0) return alert('Корзина пуста!');
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    // Здесь должна быть интеграция с платежной системой
    // Для примера используем простой alert
    alert(`Оформляем заказ на сумму ${total} руб. В реальном магазине здесь будет переход к оплате.`);
    
    // Сохраняем заказ в базу
    db.collection("orders").add({
        items: cart.map(item => item.id),
        total: total,
        status: "pending",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert('Заказ оформлен!');
        cart = [];
        updateCart();
    });
}

// Копирование IP сервера
function copyIP() {
    const ipElement = document.getElementById('server-ip');
    const ip = ipElement.textContent;
    navigator.clipboard.writeText(ip);
    alert('IP скопирован в буфер обмена!');
}

// Загрузка данных при открытии страницы
window.onload = function() {
    loadCategories();
    loadProducts();
    
    // Здесь может быть запрос к API сервера для получения онлайна
    // document.getElementById('online-count').textContent = onlineCount;
};