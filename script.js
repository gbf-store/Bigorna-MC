const cart = [];

const cartCount = document.getElementById("cartCount");
const cartModal = document.getElementById("cartModal");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

document.getElementById("year").textContent = new Date().getFullYear();

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function renderCart() {
  cartCount.textContent = cart.length;

  if (!cart.length) {
    cartItems.innerHTML =
      '<p style="color:#8d94a1;font-size:13px;padding:10px 0 18px;">Seu carrinho está vazio.</p>';

    cartTotal.textContent = "";
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-row">
      <span>${item.name}</span>
      <button class="remove" data-index="${index}">
        Remover
      </button>
    </div>
  `).join("");

  cartTotal.textContent =
    "Total: valores serão definidos posteriormente";

  document.querySelectorAll(".remove").forEach(button => {
    button.addEventListener("click", () => {
      cart.splice(Number(button.dataset.index), 1);

      renderCart();

      showToast("Item removido do carrinho.");
    });
  });
}

document.querySelectorAll(".buy-button").forEach(button => {

  button.addEventListener("click", () => {

    const name = button.dataset.vip;

    cart.push({
      name: name,
      price: button.dataset.price
    });

    renderCart();

    showToast(`${name} adicionado ao carrinho!`);
  });

});

document.getElementById("openCart").addEventListener("click", () => {

  renderCart();

  cartModal.hidden = false;

  document.body.style.overflow = "hidden";

});

function closeCart() {

  cartModal.hidden = true;

  document.body.style.overflow = "";

}

document.getElementById("closeCart")
  .addEventListener("click", closeCart);

cartModal.addEventListener("click", event => {

  if (event.target === cartModal) {
    closeCart();
  }

});

document.getElementById("checkout")
  .addEventListener("click", () => {

    if (!cart.length) {

      showToast(
        "Adicione um VIP ao carrinho primeiro."
      );

      return;
    }

    showToast(
      "Pagamento ainda não configurado. O Pix/e-mail será colocado aqui depois."
    );

  });

document.addEventListener("keydown", event => {

  if (
    event.key === "Escape" &&
    !cartModal.hidden
  ) {

    closeCart();

  }

});
