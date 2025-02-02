// Global Variables
let products = [];

// DOM Load Event
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// App Initialization
function initializeApp() {
    updateCalculatorInputs();
    loadProducts();
    checkLoginStatus();
}

// Login Functions
function checkLoginStatus() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        showMainContent();
        showSection('marketplace');
    }
}

function login() {
    const username = document.getElementById('username').value.trim();
    if (username) {
        localStorage.setItem('loggedInUser', username);
        showMainContent();
        showSection('marketplace');
        loadProducts();
    } else {
        showAlert('Username tidak boleh kosong!');
    }
}

function logout() {
    localStorage.removeItem('loggedInUser');
    hideMainContent();
    document.getElementById('username').value = '';
}

// UI Display Functions
function showMainContent() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
}

function hideMainContent() {
    document.getElementById('loginSection').style.display = 'flex';
    document.getElementById('mainContent').style.display = 'none';
}

function showSection(sectionId) {
    document.getElementById('marketplace').style.display = 'none';
    document.getElementById('calculator').style.display = 'none';
    document.getElementById(sectionId).style.display = 
        sectionId === 'marketplace' ? 'grid' : 'block';
}

// Product Management
function loadProducts() {
    try {
        const savedProducts = localStorage.getItem('marketplace_products');
        if (savedProducts) {
            products = JSON.parse(savedProducts);
            updateProductDisplay();
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showAlert('Gagal memuat produk');
    }
}

function saveProducts() {
    try {
        localStorage.setItem('marketplace_products', JSON.stringify(products));
    } catch (error) {
        console.error('Error saving products:', error);
        showAlert('Gagal menyimpan produk');
    }
}

function updateProductDisplay() {
    const marketplace = document.getElementById('marketplace');
    marketplace.innerHTML = '';

    products.forEach((product, index) => {
        const productCard = createProductCard(product, index);
        marketplace.appendChild(productCard);
    });
}

function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-content">
            <h3>${product.name}</h3>
            <p>Penjual: ${product.seller}</p>
            <p>Harga: Rp ${formatPrice(product.price)}</p>
            <button onclick="deleteProduct(${index})" class="delete-btn">Hapus</button>
        </div>
    `;
    return card;
}

function addProduct(event) {
    event.preventDefault();

    const seller = document.getElementById('sellerName').value.trim();
    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);

    if (!seller || !name || isNaN(price) || price <= 0) {
        showAlert('Mohon isi semua field dengan benar');
        return;
    }

    const newProduct = { seller, name, price };
    products.push(newProduct);
    saveProducts();
    updateProductDisplay();
    closeModal('addProductModal');
    showAlert('Produk berhasil ditambahkan!', 'success');
}

function deleteProduct(index) {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        products.splice(index, 1);
        saveProducts();
        updateProductDisplay();
        showAlert('Produk berhasil dihapus!', 'success');
    }
}

// Calculator Functions
function updateCalculatorInputs() {
    const calcType = document.getElementById('calcType').value;
    const inputsContainer = document.getElementById('calcInputs');

    const calculatorInputs = {
        profit: `
            <input type="number" id="revenue" placeholder="Pendapatan" required>
            <input type="number" id="costs" placeholder="Biaya" required>
        `,
        roi: `
            <input type="number" id="gain" placeholder="Keuntungan" required>
            <input type="number" id="investment" placeholder="Investasi" required>
        `,
        bep: `
            <input type="number" id="fixedCosts" placeholder="Biaya Tetap" required>
            <input type="number" id="price" placeholder="Harga per Unit" required>
            <input type="number" id="variableCosts" placeholder="Biaya Variabel per Unit" required>
        `
    };

    inputsContainer.innerHTML = calculatorInputs[calcType];
}

function calculate() {
    const calcType = document.getElementById('calcType').value;
    let result = 0;
    let message = '';

    try {
        switch (calcType) {
            case 'profit':
                const revenue = parseFloat(document.getElementById('revenue').value);
                const costs = parseFloat(document.getElementById('costs').value);
                result = revenue - costs;
                message = `Laba/Rugi: Rp ${formatPrice(result)}`;
                break;

            case 'roi':
                const gain = parseFloat(document.getElementById('gain').value);
                const investment = parseFloat(document.getElementById('investment').value);
                result = (gain - investment) / investment * 100;
                message = `ROI: ${result.toFixed(2)}%`;
                break;

            case 'bep':
                const fixedCosts = parseFloat(document.getElementById('fixedCosts').value);
                const price = parseFloat(document.getElementById('price').value);
                const variableCosts = parseFloat(document.getElementById('variableCosts').value);
                result = fixedCosts / (price - variableCosts);
                message = `Break Even Point: ${Math.ceil(result)} unit`;
                break;
        }

        document.getElementById('result').innerHTML = `
            <div class="alert alert-success">
                ${message}
            </div>
        `;
    } catch (error) {
        console.error('Calculation error:', error);
        showAlert('Mohon isi semua field dengan benar');
    }
}

// Utility Functions
function formatPrice(price) {
    return price.toLocaleString('id-ID');
}

function showAlert(message, type = 'error') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        border-radius: 5px;
        background-color: ${type === 'success' ? '#4cc9f0' : '#ff4d4d'};
        color: white;
        z-index: 1000;
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
}

// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Event Listeners for Modals
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

// Enhanced Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    modal.style.display = 'block';

    // Reset form if it's product modal
    if (modalId === 'addProductModal') {
        document.getElementById('addProductForm').reset();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300); // Match transition duration
}

// Enhanced Event Listeners for Modals
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target.id);
    }
};

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            closeModal(activeModal.id);
        }
    }
});

// Prevent modal content clicks from closing modal
document.querySelectorAll('.modal-content').forEach(content => {
    content.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});
