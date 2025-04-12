const db = getDb();
const auth = getAuth();

let currentProductId = null;

// Вход в админ-панель
function adminLogin() {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('admin-panel').style.display = 'block';
            loadAdminData();
        })
        .catch(error => {
            alert('Ошибка входа: ' + error.message);
        });
}

// Загрузка данных для админки
function loadAdminData() {
    loadProductsForAdmin();
    loadCategoriesForSelect();
}

// Загрузка товаров для админки
function loadProductsForAdmin() {
    db.collection("products").get().then(querySnapshot => {
        const productsList = document.getElementById('products-list');
        productsList.innerHTML = '';
        
        querySnapshot.forEach(doc => {
            const product = doc.data();
            const productElement = document.createElement('div');
            productElement.className = 'admin-item';
            productElement.innerHTML = `
                <div class="item-name">${product.name}</div>
                <div class="item-price">${product.price} руб</div>
                <div class="item-actions">
                    <button onclick="editProduct('${doc.id}')">✏️</button>
                    <button onclick="deleteProduct('${doc.id}')">🗑️</button>
                </div>
            `;
            productsList.appendChild(productElement);
        });
    });
}

// Загрузка категорий для выпадающего списка
function loadCategoriesForSelect() {
    db.collection("categories").get().then(querySnapshot => {
        const select = document.getElementById('product-category');
        select.innerHTML = '<option value="">Выберите категорию</option>';
        
        querySnapshot.forEach(doc => {
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = doc.data().name;
            select.appendChild(option);
        });
    });
}

// Показать форму товара
function showProductForm(product = null) {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('modal-title');
    
    if (product) {
        title.textContent = 'Редактировать товар';
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-desc').value = product.description;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-command').value = product.command;
        currentProductId = product.id;
    } else {
        title.textContent = 'Добавить товар';
        document.getElementById('product-form').reset();
        currentProductId = null;
    }
    
    modal.style.display = 'block';
}

// Сохранение товара
function saveProduct() {
    const productData = {
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        description: document.getElementById('product-desc').value,
        price: Number(document.getElementById('product-price').value),
        command: document.getElementById('product-command').value
    };
    
    if (!productData.name || !productData.category || !productData.price) {
        return alert('Заполните обязательные поля!');
    }
    
    if (currentProductId) {
        // Редактирование существующего товара
        db.collection("products").doc(currentProductId).update(productData)
            .then(() => {
                alert('Товар обновлен!');
                closeModal();
                loadProductsForAdmin();
            });
    } else {
        // Добавление нового товара
        db.collection("products").add(productData)
            .then(() => {
                alert('Товар добавлен!');
                closeModal();
                loadProductsForAdmin();
            });
    }
}

// Удаление товара
function deleteProduct(productId) {
    if (confirm('Удалить этот товар?')) {
        db.collection("products").doc(productId).delete()
            .then(() => {
                alert('Товар удален!');
                loadProductsForAdmin();
            });
    }
}

// Редактирование товара
function editProduct(productId) {
    db.collection("products").doc(productId).get()
        .then(doc => {
            if (doc.exists) {
                showProductForm({ id: doc.id, ...doc.data() });
            }
        });
}

// Закрытие модального окна
function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
}

// Проверка авторизации при загрузке страницы
auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        loadAdminData();
    }
});