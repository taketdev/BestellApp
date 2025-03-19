function toggleCart(){
    const cart = document.getElementById("cart");
    cart.classList.toggle("d_none");
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
        cartContainer.innerHTML = "<p>Dein Warenkorb ist leer!</p>";
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
            <div class="cart_div div-underline">
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
        orderButton.disabled = false; // ✅ Aktiv
    } else {
        orderButton.disabled = true; // ❌ Deaktiviert
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
    }   else {
        cartItems.push({ ...dish, quantity: 1 });
    }
    console.log("cartItems nach addToCart:", cartItems); // TEST
    renderCart();
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

renderCart();
document.addEventListener("DOMContentLoaded", function() {
    const orderButton = document.getElementById("orderButton");
    if (orderButton) {
        orderButton.disabled = true; // ❌ Direkt deaktivieren!
    }
});