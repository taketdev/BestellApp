let cartItems = [];

function formatPrice(price) {
    return price.toFixed(2).replace('.', ',') + ' €';
}

function calculateSubtotal() {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getDeliveryCost() {
    const deliverySwitch = document.getElementById("deliverySwitch");
    return deliverySwitch && deliverySwitch.checked ? 5.00 : 0;
}

function updateTotals(subtotal, deliveryCost) {
    document.getElementById("subtotal_value").textContent = formatPrice(subtotal);
    document.getElementById("delivery_cost").textContent = formatPrice(deliveryCost);
    document.getElementById("total_value").textContent = formatPrice(subtotal + deliveryCost);
}

function updateOrderButton(subtotal) {
    const orderButton = document.getElementById("orderButton");
    const orderWarning = document.getElementById("orderWarning");

    if (subtotal >= 15) {
        orderButton.disabled = false;
        if (orderWarning) orderWarning.style.display = "none";
    } else {
        orderButton.disabled = true;
        if (orderWarning) orderWarning.style.display = "block";
        showNotification("Mindestbestellwert: 15,00 €", "error");
    }

}

function createCartItemElement(item) {
    return getCartItemHTML(item);
}

function updateCartDisplay() {
    const cartContainer = document.getElementById("cartItems");
    cartContainer.innerHTML = "";

    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p style="text-align: center; color: rgba(128, 128, 128, 0.500);">Dein Warenkorb ist leer!</p>';
        return;
    }

    cartItems.forEach((item) => {
        cartContainer.appendChild(createCartItemElement(item));
    });
}

function renderCart() {
    let subtotal = calculateSubtotal();
    let deliveryCost = getDeliveryCost();

    updateTotals(subtotal, deliveryCost);
    updateCartDisplay();
    updateOrderButton(subtotal);
}

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

function addToCartFromButton(dishId) {
    const dish = dishes.find((d) => d.id === dishId);
    if (dish) {
        addToCart(dish);
    }
}

function increaseQuantity(dishId) {
    let item = cartItems.find((d) => d.id === dishId);
    if (item) {
        item.quantity++;
        renderCart();
    }
}

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

function removeFromCart(dishId) {
    cartItems = cartItems.filter((item) => item.id !== dishId);
    renderCart();
}

function toggleCart() {
    const cart = document.getElementById("cart");
    const overlay = document.getElementById("cartOverlay");

    cart.classList.toggle("d_none");

    if (!cart.classList.contains("d_none")) {
        overlay.classList.add("show");
    } else {
        overlay.classList.remove("show");
    }
}

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

document.addEventListener("DOMContentLoaded", function() {
    renderCart();

    const orderButton = document.getElementById("orderButton");
    if (orderButton) {
        orderButton.disabled = true;
        orderButton.addEventListener("click", completeOrder);
    }
});