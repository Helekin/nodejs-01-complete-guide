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
    cart.cartItems.reduce((acc, item) => {
      const totalPriceForItem = Number(item.price) * Number(item.qty);
      return acc + totalPriceForItem;
    }, 0)
  );

  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 10);

  cart.taxPrice = addDecimals(Number(0.1 * cart.itemsPrice).toFixed(2));

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

function updateCart(productId, selectedQty) {
  let cart = JSON.parse(localStorage.getItem("cart"));

  let existItem = cart.cartItems.find((item) => item.id === productId);

  if (existItem) {
    cart.cartItems = cart.cartItems.map((item) =>
      item.id === existItem.id
        ? { ...existItem, qty: Number(selectedQty) }
        : item
    );
  }

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => {
      const totalPriceForItem = Number(item.price) * Number(item.qty);
      return acc + totalPriceForItem;
    }, 0)
  );

  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 10);

  cart.taxPrice = addDecimals(Number(0.1 * cart.itemsPrice).toFixed(2));

  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();
  updateCartSubTotal();
}

function updateCartSubTotal() {
  let cart = JSON.parse(localStorage.getItem("cart"));

  let totalItems = 0;
  let subTotal = 0;

  if (cart && cart.cartItems) {
    totalItems = cart.cartItems.reduce((count, item) => count + item.qty, 0);

    subTotal = addDecimals(
      cart.cartItems.reduce((acc, item) => {
        const totalPriceForItem = Number(item.price) * Number(item.qty);
        return acc + totalPriceForItem;
      }, 0)
    );
  }

  const totalItemsElement = document.getElementById("cart-total-items");
  const subTotalElement = document.getElementById("cart-subtotal");

  if (totalItemsElement) {
    totalItemsElement.textContent =
      "Subtotal (" + totalItems.toString() + ") items";
  }

  if (subTotalElement) {
    subTotalElement.textContent = "$ " + subTotal.toString();
  }
}

updateCartCount();
