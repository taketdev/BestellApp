// Toggle cart
function toggleCart() {
    const cart = document.getElementById("cart");
    const overlay = document.getElementById("cartOverlay");
    
    cart.classList.toggle("d_none");
    overlay.classList.toggle("show", !cart.classList.contains("d_none"));
}

// Cart array
let cartItems = [];

// Render cart
function renderCart() {
    const cartContainer = document.getElementById("cartItems");
    const subtotalElement = document.getElementById("subtotal_value");
    const deliveryCostElement = document.getElementById("delivery_cost");
    const totalElement = document.getElementById("total_value");
    const deliveryStatus = document.getElementById("delivery_status");
    const deliverySwitch = document.getElementById("deliverySwitch");
    const orderButton = document.getElementById("orderButton");
    const orderWarning = document.getElementById("orderWarning");
    
    if (!cartContainer) return;
    cartContainer.innerHTML = "";
    
    let deliveryCost = (deliverySwitch?.checked) ? 5.00 : 0;
    if (deliveryStatus) deliveryStatus.textContent = deliveryCost ? "Lieferung" : "Abholung";
    
    let subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let total = subtotal + deliveryCost;
    
    if (subtotalElement) subtotalElement.textContent = formatPrice(subtotal);
    if (deliveryCostElement) deliveryCostElement.textContent = formatPrice(deliveryCost);
    if (totalElement) totalElement.textContent = formatPrice(total);
    
    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p style="text-align: center; color: rgba(128, 128, 128, 0.500);">Dein Warenkorb ist leer!</p>';
        subtotalElement.textContent = "0,00 €";
        if (orderButton) orderButton.disabled = true;
        return;
    }
    
    cartItems.forEach((item) => {
        cartContainer.appendChild(createCartItemElement(item));
    });
    
    if (orderButton) {
        orderButton.disabled = subtotal < 15;
        orderWarning.style.display = (subtotal < 15) ? "block" : "none";
        if (subtotal < 15) showNotification("Mindestbestellwert: 15,00 €", "error");
    }
}

// Create cart item element
function createCartItemElement(item) {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cartItems");
    cartItem.innerHTML = `
        <div class="cart_div div_underline">
            <div class="cart_item">
                <div class="cart_item_name"><p><b>${item.name}</b></p></div>
                <div class="cart_item_price"><p>${formatPrice(item.price)}</p></div>
            </div>
            <div class="cart_actions">
                <div class="number_control">
                    <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">−</button>
                    <span class="quantity-number">${item.quantity}</span>
                    <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
                </div>
                <div class="remove-item">
                    <i class="fas fa-trash" onclick="removeFromCart(${item.id})"></i>
                </div>
            </div>
        </div>
    `;
    return cartItem;
}

// Format price
function formatPrice(price) {
    return price.toFixed(2).replace('.', ',') + ' €';
}

// Add to cart
function addToCart(dish) {
    let existingItem = cartItems.find((item) => item.id === dish.id);
    existingItem ? existingItem.quantity++ : cartItems.push({ ...dish, quantity: 1 });
    renderCart();
    showNotification("Gericht wurde zum Warenkorb hinzugefügt!", "success");
}

// Increase quantity
function increaseQuantity(dishId) {
    let item = cartItems.find((d) => d.id === dishId);
    if (item) {
        item.quantity++;
        renderCart();
    }
}

// Decrease quantity
function decreaseQuantity(dishId) {
    let item = cartItems.find((d) => d.id === dishId);
    if (item) {
        item.quantity--;
        item.quantity === 0 ? removeFromCart(dishId) : renderCart();
    }
}

// Remove from cart
function removeFromCart(dishId) {
    cartItems = cartItems.filter((item) => item.id !== dishId);
    renderCart();
}

// Complete order
function completeOrder() {
    if (cartItems.length === 0) return;
    cartItems = [];
    renderCart();
    showNotification("🎉 Deine Bestellung wurde abgeschickt!", "success");
    const orderButton = document.getElementById("orderButton");
    if (orderButton) {
        orderButton.disabled = true;
        setTimeout(() => { if (cartItems.length >= 15) orderButton.disabled = false; }, 3000);
    }
}

// Show notification
function showNotification(message, type = "success") {
    const container = document.getElementById("notificationContainer");
    if (!container) return;
    
    const notification = document.createElement("div");
    notification.classList.add("notification", "show", type === "error" ? "error" : "");
    notification.textContent = message;
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add("hide");
        setTimeout(() => notification.remove(), 500);
    }, 2000);
}

// Event listeners & initial rendering
document.addEventListener("DOMContentLoaded", function() {
    const orderButton = document.getElementById("orderButton");
    if (orderButton) orderButton.disabled = true;
});
document.getElementById("orderButton").addEventListener("click", completeOrder);
renderCart();
