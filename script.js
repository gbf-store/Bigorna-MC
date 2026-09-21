document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     ELEMENTOS
  ========================= */

  const cartButton = document.getElementById("cart-button");
  const cartModal = document.getElementById("cart-modal");
  const closeCart = document.getElementById("close-cart");

  const cartItemsElement = document.getElementById("cart-items");
  const cartCountElement = document.getElementById("cart-count");
  const cartTotalElement = document.getElementById("cart-total");

  const toast = document.getElementById("toast");
  const paymentButton = document.getElementById("payment-button");

  /* =========================
     CARRINHO
  ========================= */

  let cart = [];

  /* =========================
     FORMATAR PREÇO
  ========================= */

  function formatPrice(price) {

    if (
      price === null ||
      price === undefined ||
      price === "" ||
      price === "A definir"
    ) {
      return "A definir";
    }

    const number = Number(price);

    if (Number.isNaN(number)) {
      return "A definir";
    }

    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  /* =========================
     ADICIONAR
  ========================= */

  function addToCart(name, price) {

    const existing = cart.find(
      item => item.name === name
    );

    if (existing) {

      existing.quantity += 1;

    } else {

      cart.push({
        name: name,
        price: price,
        quantity: 1
      });

    }

    updateCart();

    showToast(
      `${name} foi adicionado ao carrinho.`
    );
  }

  /* =========================
     REMOVER 1
  ========================= */

  function decreaseItem(name) {

    const item = cart.find(
      item => item.name === name
    );

    if (!item) return;

    item.quantity -= 1;

    if (item.quantity <= 0) {

      cart = cart.filter(
        product => product.name !== name
      );

    }

    updateCart();
  }

  /* =========================
     AUMENTAR
  ========================= */

  function increaseItem(name) {

    const item = cart.find(
      item => item.name === name
    );

    if (!item) return;

    item.quantity += 1;

    updateCart();
  }

  /* =========================
     REMOVER COMPLETAMENTE
  ========================= */

  function removeItem(name) {

    cart = cart.filter(
      item => item.name !== name
    );

    updateCart();

    showToast(
      `${name} foi removido do carrinho.`
    );
  }

  /* =========================
     ATUALIZAR CARRINHO
  ========================= */

  function updateCart() {

    renderCart();

    updateCartCount();

    updateTotal();
  }

  /* =========================
     CONTADOR
  ========================= */

  function updateCartCount() {

    const totalQuantity = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );

    cartCountElement.textContent = totalQuantity;
  }

  /* =========================
     LISTA DO CARRINHO
  ========================= */

  function renderCart() {

    if (cart.length === 0) {

      cartItemsElement.innerHTML = `
        <div class="empty-cart">
          🛒<br><br>
          Seu carrinho está vazio.<br>
          Escolha um VIP para começar.
        </div>
      `;

      return;
    }

    cartItemsElement.innerHTML = cart
      .map(item => {

        return `
          <div class="cart-item">

            <div class="cart-item-info">

              <strong>
                ${escapeHTML(item.name)}
              </strong>

              <small>
                ${formatPrice(item.price)} por unidade
              </small>

            </div>


            <div class="cart-item-controls">

              <button
                class="quantity-button decrease"
                data-name="${escapeHTML(item.name)}"
                type="button"
                aria-label="Diminuir quantidade"
              >
                −
              </button>


              <span class="quantity">
                ${item.quantity}
              </span>


              <button
                class="quantity-button increase"
                data-name="${escapeHTML(item.name)}"
                type="button"
                aria-label="Aumentar quantidade"
              >
                +
              </button>


              <button
                class="remove-item"
                data-name="${escapeHTML(item.name)}"
                type="button"
              >
                REMOVER
              </button>

            </div>

          </div>
        `;

      })
      .join("");

    attachCartButtons();
  }

  /* =========================
     BOTÕES DOS ITENS
  ========================= */

  function attachCartButtons() {

    document
      .querySelectorAll(".increase")
      .forEach(button => {

        button.addEventListener("click", () => {

          increaseItem(
            button.dataset.name
          );

        });

      });


    document
      .querySelectorAll(".decrease")
      .forEach(button => {

        button.addEventListener("click", () => {

          decreaseItem(
            button.dataset.name
          );

        });

      });


    document
      .querySelectorAll(".remove-item")
      .forEach(button => {

        button.addEventListener("click", () => {

          removeItem(
            button.dataset.name
          );

        });

      });

  }

  /* =========================
     TOTAL
  ========================= */

  function updateTotal() {

    /*
      Os preços ainda estão como
      "A definir".

      Quando você colocar valores
      reais nos data-price do HTML,
      o sistema automaticamente
      poderá calcular o total.
    */

    const hasUndefinedPrice = cart.some(
      item =>
        item.price === "A definir" ||
        item.price === "" ||
        item.price === null
    );

    if (hasUndefinedPrice) {

      cartTotalElement.textContent =
        "A definir";

      return;
    }

    const total = cart.reduce(
      (sum, item) =>
        sum + Number(item.price) * item.quantity,
      0
    );

    cartTotalElement.textContent =
      formatPrice(total);
  }

  /* =========================
     ABRIR CARRINHO
  ========================= */

  function openCart() {

    cartModal.hidden = false;

    document.body.style.overflow = "hidden";
  }

  /* =========================
     FECHAR CARRINHO
  ========================= */

  function closeCartModal() {

    cartModal.hidden = true;

    document.body.style.overflow = "";
  }

  /* =========================
     BOTÃO CARRINHO
  ========================= */

  cartButton.addEventListener(
    "click",
    openCart
  );

  closeCart.addEventListener(
    "click",
    closeCartModal
  );


  /* =========================
     CLICAR FORA
  ========================= */

  cartModal.addEventListener(
    "click",
    event => {

      if (
        event.target === cartModal
      ) {

        closeCartModal();

      }

    }
  );


  /* =========================
     ESC
  ========================= */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        !cartModal.hidden
      ) {

        closeCartModal();

      }

    }
  );


  /* =========================
     BOTÕES ADICIONAR
  ========================= */

  document
    .querySelectorAll(".add-to-cart")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const name =
            button.dataset.vip;

          const price =
            button.dataset.price;

          addToCart(
            name,
            price
          );

        }
      );

    });


  /* =========================
     PAGAMENTO
  ========================= */

  paymentButton.addEventListener(
    "click",
    () => {

      if (cart.length === 0) {

        showToast(
          "Adicione pelo menos um VIP ao carrinho."
        );

        return;
      }

      showToast(
        "Pagamento iniciado. Tire o print do comprovante e envie no ticket do Discord."
      );

    }
  );


  /* =========================
     TOAST
  ========================= */

  let toastTimeout;

  function showToast(message) {

    clearTimeout(toastTimeout);

    toast.textContent = message;

    toast.hidden = false;

    toastTimeout = setTimeout(
      () => {

        toast.hidden = true;

      },
      3500
    );

  }


  /* =========================
     PARTÍCULAS
  ========================= */

  const particles =
    document.getElementById("particles");

  function createParticles() {

    const amount =
      window.innerWidth < 600
        ? 30
        : 55;

    for (
      let i = 0;
      i < amount;
      i++
    ) {

      const particle =
        document.createElement("span");

      particle.className =
        "particle";

      particle.style.left =
        Math.random() * 100 + "%";

      particle.style.animationDuration =
        8 + Math.random() * 15 + "s";

      particle.style.animationDelay =
        Math.random() * 12 + "s";

      const size =
        1 + Math.random() * 3;

      particle.style.width =
        size + "px";

      particle.style.height =
        size + "px";

      particles.appendChild(
        particle
      );

    }

  }

  createParticles();


  /* =========================
     SEGURANÇA DE TEXTO
  ========================= */

  function escapeHTML(text) {

    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  }


  /* =========================
     INICIALIZAÇÃO
  ========================= */

  updateCart();

});
