// Toggle cart
function toggleCart() {
    const cart = document.getElementById("cart");
    const overlay = document.getElementById("cartOverlay");

    cart.classList.toggle("d_none");

    // Cart visible, show overlay
    if (!cart.classList.contains("d_none")) {
        overlay.classList.add("show");
    } else {
        overlay.classList.remove("show");
    }
}

// Cart array
let cartItems = [];

function renderCart() {
    const cartContainer = document.getElementById("cartItems");
    const subtotalElement = document.getElementById("subtotal_value");
    const deliveryCostElement = document.getElementById("delivery_cost");
    const deliveryStatus = document.getElementById("delivery_status");
    const deliverySwitch = document.getElementById("deliverySwitch");
    const orderButton = document.getElementById("orderButton");
    const orderWarning = document.getElementById("orderWarning");

    let deliveryCost = 0;

    if (deliverySwitch && deliverySwitch.checked) {
        deliveryCost = 5.00;
        if (deliveryStatus) deliveryStatus.textContent = "Lieferung";
    } else {
        if (deliveryStatus) deliveryStatus.textContent = "Abholung";
    }

    let subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Update intermediate amount
    if (subtotalElement) {
        subtotalElement.textContent = formatPrice(subtotal);
    }

    // Total amount
    let total = subtotal + deliveryCost;

    // Display in HTML
    const totalElement = document.getElementById("total_value");
    if (deliveryCostElement) {
        deliveryCostElement.textContent = formatPrice(deliveryCost);
    }
    if (totalElement) {
        totalElement.textContent = formatPrice(total);
    }

    // No cart, return
    if (!cartContainer) return;

    // Empty the cart container
    cartContainer.innerHTML = "";

    // Cart empty, display this message
    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p style="text-align: center; color: rgba(128, 128, 128, 0.500);">Dein Warenkorb ist leer!</p>';
        if (subtotalElement) {
            subtotalElement.textContent = "0,00 €";
        }
        if (orderButton) {
            orderButton.disabled = true; // Disable button if cart is empty
        }
        return;
    }

    // Create for every dish in cart an element
    cartItems.forEach((item) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cartItems");
        cartItem.innerHTML = `
            <div class="cart_div div_underline">
              <div class="cart_item">
                <div class="cart_item_name">
                  <p><b>${item.name}</b></p>
                </div>
                <div class="cart_item_price">
                  <p>${formatPrice(item.price)}</p>
                </div>
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
        cartContainer.appendChild(cartItem);
    });

    if (orderButton) {
        if (subtotal >= 15) {
            orderButton.disabled = false;
            if (orderWarning) orderWarning.style.display = "none";
        } else {
            orderButton.disabled = true;
            if (orderWarning) orderWarning.style.display = "block";
        }
        if (subtotal < 15) {
            orderButton.disabled = true;
            showNotification("Mindestbestellwert: 15,00 €", "error");
        }
    }

    subtotalElement.textContent = formatPrice(subtotal);
}

function formatPrice(price) {
    return price.toFixed(2).replace('.', ',') + ' €';
}

// Add to cart function
function addToCart(dish) {
    let existingItem = cartItems.find((item) => item.id === dish.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cartItems.push({ ...dish, quantity: 1 });
    }

    renderCart();
    showNotification("Gericht wurde zum Warenkorb hinzugefügt!", "success");
}

// Notification function
function showNotification(message, type = "success") {
    const container = document.getElementById("notificationContainer");
    if (!container) return;

    const notification = document.createElement("div");
    notification.classList.add("notification", "show");
    if (type === "error") {
        notification.classList.add("error");
    }
    notification.textContent = message;

    container.appendChild(notification);

    setTimeout(() => {
        notification.classList.add("hide");
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 2000);
}

// Add to cart from button function
function addToCartFromButton(dishId) {
    console.log("addToCartFromButton wurde mit ID", dishId, "aufgerufen!");
    const dish = dishes.find((d) => d.id === dishId);
    if (dish) {
        addToCart(dish);
    }
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
        if (item.quantity === 0) {
            removeFromCart(dishId);
        } else {
            renderCart();
        }
    }
}

// Remove from cart
function removeFromCart(dishId) {
    cartItems = cartItems.filter((item) => item.id !== dishId);
    renderCart();
}

// Complete order function
function completeOrder() {
    if (cartItems.length === 0) return;

    cartItems = [];
    renderCart();

    showNotification("🎉 Deine Bestellung wurde abgeschickt!", "success");

    const orderButton = document.getElementById("orderButton");
    if (orderButton) {
        orderButton.disabled = true;
        setTimeout(() => {
            if (cartItems.length >= 15) {
                orderButton.disabled = false;
            }
        }, 3000);
    }
}

renderCart();
document.addEventListener("DOMContentLoaded", function() {
    const orderButton = document.getElementById("orderButton");
    if (orderButton) {
        orderButton.disabled = true;
    }
});
document.getElementById("orderButton").addEventListener("click", completeOrder);
