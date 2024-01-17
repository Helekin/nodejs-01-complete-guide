document.querySelectorAll("[data-product]").forEach(function (button) {
  button.addEventListener("click", function (event) {
    const product = JSON.parse(event.target.getAttribute("data-product"));
    const qty = document.getElementById("qty").value;
    addToCart(product, qty);
  });
});

function addDecimals(num) {
  return (Math.round(num * 100) / 100).toFixed(2);
}

function addToCart(product, qty) {
  let cart = localStorage.getItem("cart");
  cart = cart
    ? JSON.parse(cart)
    : { cartItems: [], shippingAddress: {}, paymentMethod: "Paypal" };

  const existItem = cart.cartItems.find((item) => item.id === product.id);

  if (existItem) {
    cart.cartItems = cart.cartItems.map((item) =>
      item.id === existItem.id ? { ...product, qty: Number(qty) } : item
    );
  } else {
    cart.cartItems = [...cart.cartItems, { ...product, qty: Number(qty) }];
  }

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * qty, 0)
  );

  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 10);

  cart.taxPrice = addDecimals(Number(0.15 * cart.itemsPrice).toFixed(2));

  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();
}

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart"));

  let totalCount = 0;

  if (cart && cart.cartItems) {
    totalCount = cart.cartItems.reduce((count, item) => count + item.qty, 0);
  }

  const cartCountElement = document.getElementById("cart-count");

  if (cartCountElement) {
    cartCountElement.textContent = totalCount.toString();
  }
}

function updateCartBySelectQty(productId, selectedQty) {
  const cartTotalPrice = JSON.parse(localStorage.getItem("cart"));

  const product = cartTotalPrice.cartItems.find(
    (item) => item.id === productId
  );
  product.qty = parseInt(selectedQty);

  const subtotalHtml = `<div class='card'>
    <ul class='list-group list-group-flush'>
      <li class='list-group-item'>
        <h2>Subtotal (${cartTotalPrice.cartItems.reduce(
          (acc, item) => acc + item.qty,
          0
        )}) items</h2>
      </li>
      <li class='list-group-item'>
        <h3>$ ${cartTotalPrice.cartItems
          .reduce((acc, item) => acc + item.qty * item.price, 0)
          .toFixed(2)}</h3>
      </li>
      <li class='list-group-item'>
        <button type='button' class='btn btn-primary' onclick=''>Proceed To Checkout</button>
      </li>
    </ul>
  </div>`;

  document.getElementById("subtotalContainer").innerHTML = subtotalHtml;
}

updateCartCount();
