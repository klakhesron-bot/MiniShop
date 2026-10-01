let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartItems = document.getElementById("cart-items");

const productRequests = cart.map(function(product) {
    return fetch("/api/produits/" + product.id)
       .then(function(response) {
    if (!response.ok) {
        throw new Error("Produit introuvable");
    }

    return response.json();
});
});
console.log(productRequests);
Promise.all(productRequests)
   .then(function(products) {
    let total = 0;

   cart.forEach(function(cartProduct) {

    const item = document.createElement("div");

item.classList.add("cart-item");

    const productFromServer = products.find(function(product) {
        return product.id === cartProduct.id;
    });

    

    console.log("Nom depuis le serveur :", productFromServer.name);
console.log("Prix depuis le serveur :", productFromServer.price);
console.log("Image depuis le serveur :", productFromServer.image);
console.log("Quantité depuis le panier :", cartProduct.quantity);

const productNameElement = document.createElement("h3");

productNameElement.textContent = productFromServer.name;

item.appendChild(productNameElement);

const productPriceElement = document.createElement("p");

productPriceElement.textContent =
    productFromServer.price + " FCFA";

item.appendChild(productPriceElement);

const productImageElement = document.createElement("img");

productImageElement.src = productFromServer.image;
productImageElement.alt = productFromServer.name;

item.appendChild(productImageElement);

const quantityElement = document.createElement("p");

quantityElement.textContent =
    "Quantité : " + cartProduct.quantity;

item.appendChild(quantityElement);

const subtotalElement = document.createElement("p");

subtotalElement.textContent =
    "Sous-total : " +
    (productFromServer.price * cartProduct.quantity) +
    " FCFA";

item.appendChild(subtotalElement);

const decreaseButton = document.createElement("button");

decreaseButton.textContent = "-";

decreaseButton.addEventListener("click", function() {

    cartProduct.quantity -= 1;

    if (cartProduct.quantity <= 0) {
        cart = cart.filter(function(item) {
            return item.id !== cartProduct.id;
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    location.reload();
});

item.appendChild(decreaseButton);

const increaseButton = document.createElement("button");

increaseButton.textContent = "+";

increaseButton.addEventListener("click", function() {

    cartProduct.quantity += 1;

    localStorage.setItem("cart", JSON.stringify(cart));

    location.reload();
});

item.appendChild(increaseButton);

const deleteButton = document.createElement("button");

deleteButton.textContent = "Supprimer";

deleteButton.addEventListener("click", function() {

    cart = cart.filter(function(item) {
        return item.id !== cartProduct.id;
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    location.reload();
});

item.appendChild(deleteButton);
cartItems.appendChild(item);

total = total + (productFromServer.price * cartProduct.quantity);

});
const cartTotal = document.getElementById("cart-total");

cartTotal.textContent = "Total : " + total + " FCFA";
})

.catch(function(error) {
    console.log("Erreur :", error.message);

    cartItems.textContent =
        "⚠️ " + error.message;
});



const clearCartButton = document.getElementById("clear-cart");

clearCartButton.addEventListener("click", function() {
    localStorage.removeItem("cart");
    location.reload();
});



