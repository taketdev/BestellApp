function toggleCart() {
    const cart = document.getElementById("cart");
    const overlay = document.getElementById("cartOverlay");

    // Umschalten der Sichtbarkeit des Warenkorbs
    cart.classList.toggle("d_none");
    
    // Falls der Warenkorb sichtbar ist, Overlay anzeigen, sonst ausblenden
    if (!cart.classList.contains("d_none")) {
        overlay.classList.add("show");
    } else {
        overlay.classList.remove("show");
    }
}

// Cart Array
let cartItems = [];

function renderCart(){
    const cartContainer = document.getElementById("cartItems");
    const subtotalElement = document.getElementById("subtotal_value");
    // Lieferkosten überprüfen
    const deliveryCostElement = document.getElementById("delivery_cost");
    const deliveryStatus = document.getElementById("delivery_status")
    const deliverySwitch = document.getElementById("deliverySwitch");
    const orderButton = document.getElementById("orderButton");
    // Mindesbestellwert prüfen und Button Anpassen
    const orderWarning = document.getElementById("orderWarning");


    let deliveryCost = 0;

    if (deliverySwitch && deliverySwitch.checked) {
        deliveryCost = 5.00;
        if (deliveryStatus) deliveryStatus.textContent = "Lieferung";
    } else {
        if (deliveryStatus) deliveryStatus.textContent = "Abholung";
    }

    let subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Zwischensumme im DOM aktualiesieren.
    if (subtotalElement) {
        subtotalElement.textContent = formatPrice(subtotal);
    }

    // Gesamtsumme berechnen
    let total = subtotal + deliveryCost;

    // Werte im HTML anzeigen
    const totalElement = document.getElementById("total_value");
    if (deliveryCostElement) {
        deliveryCostElement.textContent = formatPrice(deliveryCost);
    }
    if (totalElement) {
        totalElement.textContent = formatPrice(total);
    }

    // Falls es noch kein Cart-Element gibt, breche ab
    if (!cartContainer) return;

    // Leere den Warenkorb-Container vor jedem Rendern
    cartContainer.innerHTML = "";

    // Falls der Warenkorb leer ist zeige die Nachricht an
    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p style="text-align: center; color: rgba(128, 128, 128, 0.500);">Dein Warenkorb ist leer!</p>';
        if (subtotalElement) {
            subtotalElement.textContent = "0,00 €";
        }
        if (orderButton) {
            orderButton.disabled = true; // ❌ Button deaktivieren, wenn der Warenkorb leer ist!
        }
        return; // Funktion verlassen
    }


        // Create for every Dish in cart a element
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

// **MINDESTBESTELLWERT PRÜFEN UND BUTTON DEAKTIVIEREN**
if (orderButton) {
    if (subtotal >= 15) {
        orderButton.disabled = false; // ✅ Aktivieren
        if (orderWarning) orderWarning.style.display = "none"; // 🔹 Warnung ausblenden
    } else {
        orderButton.disabled = true; // ❌ Deaktivieren
        if (orderWarning) orderWarning.style.display = "block"; // 🔹 Warnung anzeigen
    }
    if (subtotal < 15) {
        orderButton.disabled = true;
        showNotification("Mindestbestellwert: 15,00 €", "error"); // ❌ Rot anzeigen
    }
}

subtotalElement.textContent = formatPrice(subtotal);
} 

function formatPrice(price){
    return price.toFixed(2).replace('.', ',') + ' €';
}



// add to cart
function addToCart(dish){
    let existingItem = cartItems.find((item) => item.id === dish.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cartItems.push({ ...dish, quantity: 1 });
    }

    renderCart();
    showNotification("Gericht wurde zum Warenkorb hinzugefügt!", "success");
}
// ✅ Funktion, um die Benachrichtigung zu zeigen
function showNotification(message, type = "success") {
    const container = document.getElementById("notificationContainer");
    if (!container) return;

    // Neue Nachricht erstellen
    const notification = document.createElement("div");
    notification.classList.add("notification", "show");
    if (type === "error") {
        notification.classList.add("error"); // ❌ Rote Warnung für Mindestbestellwert
    }
    notification.textContent = message;

    // Nachricht zum Container hinzufügen
    container.appendChild(notification);

    // Nach 2 Sekunden ausblenden
    setTimeout(() => {
        notification.classList.add("hide");
        setTimeout(() => {
            notification.remove(); // Nach der Animation löschen
        }, 500);
    }, 2000);
}

// Button function, add dish to cart
function addToCartFromButton(dishId){
    console.log("addToCartFromButton wurde mit ID", dishId, "aufgerufen!");
    const dish = dishes.find((d) => d.id === dishId);
    if (dish) {
        addToCart(dish);
    }
}

// increase function
function increaseQuantity(dishId) {
    let item = cartItems.find((d) => d.id === dishId);
    if (item) {
        item.quantity++;
        renderCart();
    }
}

// decrease function
function decreaseQuantity(dishId) {
    let item = cartItems.find((d) => d.id === dishId);
    if (item) {
        item.quantity--;
        if (item.quantity === 0) {
            removeFromCart(dishId);
        }   else {
            renderCart();
        }
    }
}

// remove function
function removeFromCart(dishId) {
    cartItems = cartItems.filter((item) => item.id !== dishId);
    renderCart();
}

// order button function
function completeOrder(){
    if (cartItems.length === 0) return;

    cartItems = [];
    renderCart();

    // Bestellbestätigung
    showNotification("🎉 Deine Bestellung wurde abgeschickt!", "success");

    // Button für 3sek deaktievieren
    const orderButton = document.getElementById("orderButton");
        if (orderButton) {
    orderButton.disabled = true;
    setTimeout(() => {
        if (cartItems.length >= 15) {
            orderButton.disabled = false; // Nur aktivieren, wenn Warenwert über 15 €
        }
    }, 3000);
}};

renderCart();
document.addEventListener("DOMContentLoaded", function() {
    const orderButton = document.getElementById("orderButton");
    if (orderButton) {
        orderButton.disabled = true; // ❌ Direkt deaktivieren!
    }
});
document.getElementById("orderButton").addEventListener("click", completeOrder);