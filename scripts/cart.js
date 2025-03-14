function toggleCart(){
    const cart = document.getElementById("cart");
    cart.classList.toggle("d_none");
}

document.getElementById("cart_btn").addEventListener("click", function() {
    this.classList.add("clicked");
    setTimeout(() => this.classList.remove("clicked"), 300);
});
