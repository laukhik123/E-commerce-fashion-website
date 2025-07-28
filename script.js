let navbar = document.querySelector('.navbar')

document.querySelector('#menu-bar').addEventListener('click', function() {
    navbar.classList.toggle('active');
});

document.querySelector('#close').addEventListener('click', function() {
    navbar.classList.remove('active');
});

// Debounce function for performance optimization
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Debounced scroll handler
const handleScroll = debounce(() => {
    navbar.classList.remove('active');

    if(window.scrollY > 100){
        document.querySelector('header').classList.add('active');
    }else{
        document.querySelector('header').classList.remove('active');
    }
}, 20); // 20ms debounce time

window.addEventListener('scroll', handleScroll);

let themeToggler = document.querySelector('#theme-toggler');

// Initialize theme based on system preference
function initializeTheme() {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (prefersDarkMode && !savedTheme)) {
        document.querySelector('body').classList.add('active');
        themeToggler.classList.add('fa-sun');
        themeToggler.setAttribute('aria-label', 'Toggle light mode');
    } else if (savedTheme === 'light') {
        document.querySelector('body').classList.remove('active');
        document.querySelector('body').classList.add('light-mode');
        themeToggler.classList.remove('fa-sun');
        themeToggler.setAttribute('aria-label', 'Toggle dark mode');
    }
}

// Toggle theme
themeToggler.addEventListener('click', function() {
    themeToggler.classList.toggle('fa-sun');
    const body = document.querySelector('body');
    
    if(themeToggler.classList.contains('fa-sun')){
        body.classList.add('active');
        body.classList.remove('light-mode');
        themeToggler.setAttribute('aria-label', 'Toggle light mode');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('active');
        body.classList.add('light-mode');
        themeToggler.setAttribute('aria-label', 'Toggle dark mode');
        localStorage.setItem('theme', 'light');
    }
});

// Listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
        if (e.matches) {
            document.querySelector('body').classList.add('active');
            themeToggler.classList.add('fa-sun');
        } else {
            document.querySelector('body').classList.remove('active');
            themeToggler.classList.remove('fa-sun');
        }
    }
});

document.querySelectorAll('.small-image-1').forEach(images =>{
    images.onclick = () =>{
        document.querySelector('.big-image-1').src = images.getAttribute('src');
    }
});

document.querySelectorAll('.small-image-2').forEach(images =>{
    images.onclick = () =>{
        document.querySelector('.big-image-2').src = images.getAttribute('src');
    }
});

document.querySelectorAll('.small-image-3').forEach(images =>{
    images.onclick = () =>{
        document.querySelector('.big-image-3').src = images.getAttribute('src');
    }
});

let countDate = new Date('Dec 25, 2025 00:00:00').getTime();

function countDown(){

    let now = new Date().getTime();
	gap = countDate - now;

    let seconds = 1000;
    let minutes = seconds * 60;
    let hours = minutes * 60;
    let days = hours * 24;

    let d = Math.floor(gap / (days));
	let h = Math.floor((gap % (days)) / (hours));
	let m = Math.floor((gap % (hours)) / (minutes));
	let s = Math.floor((gap % (minutes)) / (seconds));

    document.getElementById('days').innerText = d;
    document.getElementById('hours').innerText = h;
    document.getElementById('minutes').innerText = m;
    document.getElementById('seconds').innerText = s;

}

setInterval(function(){
    countDown()
},1000);

// Factory function to create Swiper instances with common settings
function initSwiper(selector, options = {}) {
    const defaultOptions = {
        slidesPerView: 3,
        loop: true,
        spaceBetween: 10,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            550: {
                slidesPerView: 2,
            },
            800: {
                slidesPerView: 3,
            },
            1000: {
                slidesPerView: 3,
            },
        }
    };
    
    // Merge default options with custom options
    const mergedOptions = {...defaultOptions, ...options};
    
    return new Swiper(selector, mergedOptions);
}

// Initialize product slider with navigation
var productSwiper = initSwiper(".product-slider", {
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    }
});

// Initialize review slider
var reviewSwiper = initSwiper(".review-slider");

// Shopping Cart functionality
let cart = [];
let compareItems = [];
const maxCompareItems = 2;

// Helper function to generate unique ID
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Add item to cart
function addToCart(item) {
    const existingItem = cart.find(cartItem => 
        cartItem.name === item.name && 
        cartItem.price === item.price
    );
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(item);
    }
    
    saveCart();
    updateCartCount();
    updateCartPanel();
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartCount();
    updateCartPanel();
}

// Update item quantity
function updateCartItemQuantity(itemId, newQuantity) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = parseInt(newQuantity);
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            saveCart();
            updateCartPanel();
        }
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('fashionCart', JSON.stringify(cart));
}

// Update cart count
function updateCartCount() {
    const cartIcon = document.querySelector('.fa-shopping-cart');
    if (cart.length > 0) {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Create or update cart count badge
        let badge = cartIcon.querySelector('.cart-count');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'cart-count';
            cartIcon.appendChild(badge);
        }
        badge.textContent = count;
    } else {
        const badge = cartIcon.querySelector('.cart-count');
        if (badge) {
            badge.remove();
        }
    }
}

// Toggle item in compare list
function toggleCompare(item) {
    const existingIndex = compareItems.findIndex(compItem => 
        compItem.name === item.name && 
        compItem.price === item.price
    );
    
    if (existingIndex > -1) {
        // Remove if already in compare
        compareItems.splice(existingIndex, 1);
        showNotification('Item removed from comparison!', 'info');
    } else {
        // Add to compare if not already at max
        if (compareItems.length >= maxCompareItems) {
            showNotification(`You can only compare ${maxCompareItems} items at a time. Please remove an item first.`, 'warning');
        } else {
            compareItems.push(item);
            showNotification('Item added to comparison!', 'success');
        }
    }
    
    saveCompare();
    updateComparePanel();
}

// Save compare items to localStorage
function saveCompare() {
    localStorage.setItem('fashionCompare', JSON.stringify(compareItems));
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'assertive');
        document.body.appendChild(notification);
    }
    
    // Set message and notification type
    notification.textContent = message;
    notification.className = 'notification';
    notification.classList.add(type, 'show');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        // Remove after animation completes
        setTimeout(() => {
            notification.classList.remove(type);
        }, 300);
    }, 3000);
}

// Setup cart panel
function setupCartPanel() {
    // Create cart panel if it doesn't exist
    if (!document.querySelector('.cart-panel')) {
        const cartPanel = document.createElement('div');
        cartPanel.className = 'cart-panel';
        cartPanel.setAttribute('role', 'dialog');
        cartPanel.setAttribute('aria-labelledby', 'cart-title');
        cartPanel.setAttribute('aria-hidden', 'true');
        cartPanel.innerHTML = `
            <div class="cart-header">
                <h2 id="cart-title">Shopping Cart</h2>
                <button class="close-cart" aria-label="Close cart panel">&times;</button>
            </div>
            <div class="cart-items"></div>
            <div class="cart-footer">
                <div class="cart-total">Total: <span>$0.00</span></div>
                <button class="checkout-btn" aria-label="Proceed to checkout">Checkout</button>
                <button class="clear-cart-btn" aria-label="Clear all items from cart">Clear Cart</button>
            </div>
        `;
        document.body.appendChild(cartPanel);
        
        // Add event listeners
        document.querySelector('.fa-shopping-cart').addEventListener('click', function(e) {
            e.preventDefault();
            const panel = document.querySelector('.cart-panel');
            panel.classList.toggle('active');
            panel.setAttribute('aria-hidden', panel.classList.contains('active') ? 'false' : 'true');
        });
        
        document.querySelector('.close-cart').addEventListener('click', function() {
            const panel = document.querySelector('.cart-panel');
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
        });
        
        document.querySelector('.checkout-btn').addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Your cart is empty!', 'warning');
                return;
            }
            showNotification('Checkout feature coming soon!', 'info');
            // Implement checkout functionality in the future
        });
        
        document.querySelector('.clear-cart-btn').addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Your cart is already empty!', 'info');
                return;
            }
            
            cart = [];
            saveCart();
            updateCartCount();
            updateCartPanel();
            showNotification('Cart cleared successfully!', 'success');
        });
    }
    
    // Initialize cart display
    updateCartPanel();
}

// Update cart panel content
function updateCartPanel() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalElement = document.querySelector('.cart-total span');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        totalElement.textContent = '$0.00';
    } else {
        // Calculate total
        const total = cart.reduce((sum, item) => {
            return sum + (parseFloat(item.price.replace('$', '')) * item.quantity);
        }, 0);
        
        // Update total
        totalElement.textContent = '$' + total.toFixed(2);
        
        // Render cart items
        cartItemsContainer.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-price">${item.price}</p>
                    <div class="quantity-control">
                        <button class="decrease-qty" data-id="${item.id}" aria-label="Decrease quantity">-</button>
                        <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="item-qty" aria-label="Product quantity">
                        <button class="increase-qty" data-id="${item.id}" aria-label="Increase quantity">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}" aria-label="Remove item from cart">&times;</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Add event listeners to cart item controls
        document.querySelectorAll('.decrease-qty').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.getAttribute('data-id');
                const item = cart.find(item => item.id === itemId);
                if (item && item.quantity > 1) {
                    updateCartItemQuantity(itemId, item.quantity - 1);
                }
            });
        });
        
        document.querySelectorAll('.increase-qty').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.getAttribute('data-id');
                const item = cart.find(item => item.id === itemId);
                if (item) {
                    updateCartItemQuantity(itemId, item.quantity + 1);
                }
            });
        });
        
        document.querySelectorAll('.item-qty').forEach(input => {
            input.addEventListener('change', function() {
                const itemId = this.getAttribute('data-id');
                updateCartItemQuantity(itemId, this.value);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.getAttribute('data-id');
                removeFromCart(itemId);
            });
        });
    }
}

// Setup comparison panel
function setupComparePanel() {
    if (!document.querySelector('.compare-panel')) {
        const comparePanel = document.createElement('div');
        comparePanel.className = 'compare-panel';
        comparePanel.setAttribute('role', 'dialog');
        comparePanel.setAttribute('aria-labelledby', 'compare-title');
        comparePanel.setAttribute('aria-hidden', 'true');
        comparePanel.innerHTML = `
            <div class="compare-header">
                <h2 id="compare-title">Compare Products</h2>
                <button class="close-compare" aria-label="Close compare panel">&times;</button>
            </div>
            <div class="compare-items"></div>
            <div class="compare-footer">
                <button class="clear-compare-btn" aria-label="Clear all comparison items">Clear All</button>
            </div>
        `;
        document.body.appendChild(comparePanel);
        
        // Add event listener for close button
        document.querySelector('.close-compare').addEventListener('click', function() {
            const panel = document.querySelector('.compare-panel');
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
        });
        
        // Add event listener for clear button
        document.querySelector('.clear-compare-btn').addEventListener('click', function() {
            if (compareItems.length === 0) {
                showNotification('No items to clear from comparison!', 'info');
                return;
            }
            
            compareItems = [];
            saveCompare();
            updateComparePanel();
            showNotification('Comparison list cleared!', 'success');
        });
    }
    
    updateComparePanel();
}

// Update compare panel content
function updateComparePanel() {
    const compareItemsContainer = document.querySelector('.compare-items');
    
    if (compareItems.length === 0) {
        compareItemsContainer.innerHTML = '<p class="empty-compare">No items to compare</p>';
    } else {
        compareItemsContainer.innerHTML = '';
        
        // Create comparison table
        const compareTable = document.createElement('table');
        compareTable.className = 'compare-table';
        
        // Create table rows
        const rows = {
            image: document.createElement('tr'),
            name: document.createElement('tr'),
            price: document.createElement('tr'),
            action: document.createElement('tr')
        };
        
        // Add header cells
        rows.image.appendChild(document.createElement('th')); // Empty header cell for image row
        rows.name.appendChild(createCell('th', 'Product'));
        rows.price.appendChild(createCell('th', 'Price'));
        rows.action.appendChild(document.createElement('th')); // Empty header cell for action row
        
        // Add product data
        compareItems.forEach(item => {
            // Image cell
            const imageCell = document.createElement('td');
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.name;
            imageCell.appendChild(img);
            rows.image.appendChild(imageCell);
            
            // Name cell
            rows.name.appendChild(createCell('td', item.name));
            
            // Price cell
            rows.price.appendChild(createCell('td', item.price));
            
            // Action cell
            const actionCell = document.createElement('td');
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-compare-item';
            removeBtn.setAttribute('data-id', item.id);
            removeBtn.setAttribute('aria-label', 'Remove from comparison');
            removeBtn.textContent = 'Remove';
            removeBtn.addEventListener('click', function() {
                toggleCompare(item);
            });
            
            const addToCartBtn = document.createElement('button');
            addToCartBtn.className = 'add-to-cart-btn';
            addToCartBtn.setAttribute('aria-label', 'Add to cart');
            addToCartBtn.textContent = 'Add to Cart';
            addToCartBtn.addEventListener('click', function() {
                addToCart({
                    id: generateId(),
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    quantity: 1
                });
                showNotification('Item added to cart!', 'success');
            });
            
            actionCell.appendChild(removeBtn);
            actionCell.appendChild(addToCartBtn);
            rows.action.appendChild(actionCell);
        });
        
        // Add rows to table
        compareTable.appendChild(rows.image);
        compareTable.appendChild(rows.name);
        compareTable.appendChild(rows.price);
        compareTable.appendChild(rows.action);
        
        // Add table to container
        compareItemsContainer.appendChild(compareTable);
    }
}

// Create a table cell with content
function createCell(type, content) {
    const cell = document.createElement(type);
    cell.textContent = content;
    return cell;
}

// Setup compare button in header
function setupCompareButton() {
    // Get reference to heart icon in the header
    const heartIcon = document.querySelector('header .fa-heart');
    
    // Add event listener
    heartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        const comparePanel = document.querySelector('.compare-panel');
        if (comparePanel) {
            comparePanel.classList.toggle('active');
            comparePanel.setAttribute('aria-hidden', comparePanel.classList.contains('active') ? 'false' : 'true');
        }
    });
}

// Setup lazy loading for images
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// Load cart from localStorage if available
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme based on preference
    initializeTheme();
    
    const savedCart = localStorage.getItem('fashionCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
    
    const savedCompare = localStorage.getItem('fashionCompare');
    if (savedCompare) {
        compareItems = JSON.parse(savedCompare);
    }
    
    // Initialize cart panel
    setupCartPanel();
    // Initialize compare panel
    setupComparePanel();
    // Setup compare button in header
    setupCompareButton();
    
    // Setup lazy loading for images
    setupLazyLoading();
    
    // Add event listeners to all "add to cart" buttons
    document.querySelectorAll('.btn').forEach(button => {
        if (button.textContent.toLowerCase().includes('cart')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const productElement = this.closest('.slide') || this.closest('.box');
                if (productElement) {
                    const nameElement = productElement.querySelector('h3');
                    const priceElement = productElement.querySelector('.price');
                    const imageElement = productElement.querySelector('.image img');
                    
                    if (!nameElement || !priceElement || !imageElement) {
                        showNotification('Error: Product information is incomplete', 'error');
                        return;
                    }
                    
                    const productName = nameElement.textContent;
                    const productPrice = priceElement.textContent.split(' ')[0];
                    const productImg = imageElement.src;
                    
                    addToCart({
                        id: generateId(),
                        name: productName,
                        price: productPrice,
                        image: productImg,
                        quantity: 1
                    });
                    
                    showNotification('Item added to cart successfully!', 'success');
                }
            });
        }
    });
    
    // Add event listeners to all heart icons for comparison
    document.querySelectorAll('.fa-heart').forEach(heart => {
        heart.addEventListener('click', function(e) {
            e.preventDefault();
            const productElement = this.closest('.slide') || this.closest('.box');
            if (productElement) {
                const nameElement = productElement.querySelector('h3');
                const priceElement = productElement.querySelector('.price');
                const imageElement = productElement.querySelector('.image img');
                
                if (!nameElement || !priceElement || !imageElement) {
                    showNotification('Error: Product information is incomplete', 'error');
                    return;
                }
                
                const productName = nameElement.textContent;
                const productPrice = priceElement.textContent.split(' ')[0];
                const productImg = imageElement.src;
                
                toggleCompare({
                    id: generateId(),
                    name: productName,
                    price: productPrice,
                    image: productImg
                });
            }
        });
    });
});