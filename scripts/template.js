function getDishHTML(dish) {
    return `
            <div class="cards" data-id="${dish.id}">
                <div class="food_card">
                    <img src="${dish.image}" alt="${dish.name}" />
                    <div class="food_info">
                        <h2>${dish.name}</h2>
                        <p>${dish.description}</p>
                        <div class="price">
                            <p>${formatPrice(dish.price)}</p>
                            <button onclick="addToCartFromButton(${dish.id})">+</button>
                        </div>
                    </div>
                </div>
            </div>
    `;
}

function getCartItemHTML(item) {
    const div = document.createElement("div");
    div.classList.add("cartItems");
    div.innerHTML = `
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
    return div;
}
