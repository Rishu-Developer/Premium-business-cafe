document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // MOBILE MENU
    // =========================

    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("active");
        });

        mobileMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("active");
            });
        });
    }


    // =========================
    // MENU DATA
    // =========================

    const menuItems = [
        {
            id: 1,
            name: "Classic Cappuccino",
            price: 149,
            category: "Coffee",
            emoji: "☕"
        },
        {
            id: 2,
            name: "Caramel Latte",
            price: 179,
            category: "Coffee",
            emoji: "🥤"
        },
        {
            id: 3,
            name: "Café Mocha",
            price: 189,
            category: "Coffee",
            emoji: "🍫"
        },
        {
            id: 4,
            name: "Cold Coffee",
            price: 159,
            category: "Cold Drinks",
            emoji: "🧋"
        },
        {
            id: 5,
            name: "Iced Caramel Coffee",
            price: 199,
            category: "Cold Drinks",
            emoji: "🥤"
        },
        {
            id: 6,
            name: "Masala Chai",
            price: 99,
            category: "Tea",
            emoji: "🍵"
        },
        {
            id: 7,
            name: "Chocolate Cake",
            price: 199,
            category: "Dessert",
            emoji: "🍰"
        },
        {
            id: 8,
            name: "Blueberry Cheesecake",
            price: 229,
            category: "Dessert",
            emoji: "🍰"
        },
        {
            id: 9,
            name: "Butter Croissant",
            price: 129,
            category: "Bakery",
            emoji: "🥐"
        },
        {
            id: 10,
            name: "Grilled Sandwich",
            price: 169,
            category: "Food",
            emoji: "🥪"
        },
        {
            id: 11,
            name: "Paneer Sandwich",
            price: 189,
            category: "Food",
            emoji: "🥪"
        },
        {
            id: 12,
            name: "French Fries",
            price: 139,
            category: "Snacks",
            emoji: "🍟"
        }
    ];


    // =========================
    // CART
    // =========================

    let cart = JSON.parse(localStorage.getItem("brewBeanCart")) || [];


    // =========================
    // CREATE MENU
    // =========================

    const menuContainer = document.querySelector(".menu-grid");

    if (menuContainer) {

        menuContainer.innerHTML = "";

        menuItems.forEach(item => {

            const card = document.createElement("div");

            card.className = "menu-card";

            card.innerHTML = `
                <div class="menu-image">
                    <span>${item.emoji}</span>
                </div>

                <div class="menu-info">

                    <small>${item.category}</small>

                    <h3>${item.name}</h3>

                    <div class="menu-bottom">

                        <strong>₹${item.price}</strong>

                        <button 
                            class="add-cart-btn"
                            data-id="${item.id}">
                            Add +
                        </button>

                    </div>

                </div>
            `;

            menuContainer.appendChild(card);
        });


        // Add to cart buttons

        menuContainer.addEventListener("click", event => {

            const button = event.target.closest(".add-cart-btn");

            if (!button) return;

            const id = Number(button.dataset.id);

            addToCart(id);
        });
    }


    // =========================
    // ADD TO CART
    // =========================

    function addToCart(id) {

        const item = menuItems.find(product => product.id === id);

        if (!item) return;

        const existing = cart.find(product => product.id === id);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                ...item,
                quantity: 1
            });
        }

        saveCart();

        showToast(`${item.name} added to cart 🛒`);
    }


    // =========================
    // SAVE CART
    // =========================

    function saveCart() {

        localStorage.setItem(
            "brewBeanCart",
            JSON.stringify(cart)
        );

        updateCart();
    }


    // =========================
    // CART UI
    // =========================

    function updateCart() {

        let cartButton = document.querySelector(".cart-button");

        if (!cartButton) {

            cartButton = document.createElement("button");

            cartButton.className = "cart-button";

            cartButton.innerHTML = `
                🛒 Cart
                <span class="cart-count">0</span>
            `;

            document.body.appendChild(cartButton);

            cartButton.addEventListener("click", openCart);
        }


        const count = cart.reduce(
            (total, item) => total + item.quantity,
            0
        );

        const countElement =
            cartButton.querySelector(".cart-count");

        if (countElement) {
            countElement.textContent = count;
        }
    }


    // =========================
    // CART PANEL
    // =========================

    function openCart() {

        let cartPanel = document.querySelector(".cart-panel");

        if (!cartPanel) {

            cartPanel = document.createElement("div");

            cartPanel.className = "cart-panel";

            document.body.appendChild(cartPanel);
        }

        renderCart();

        setTimeout(() => {
            cartPanel.classList.add("open");
        }, 20);
    }


    // =========================
    // RENDER CART
    // =========================

    function renderCart() {

        const cartPanel =
            document.querySelector(".cart-panel");

        if (!cartPanel) return;

        let total = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;
        });


        cartPanel.innerHTML = `

            <div class="cart-header">

                <h2>Your Cart</h2>

                <button class="close-cart">
                    ×
                </button>

            </div>


            <div class="cart-items">

                ${
                    cart.length === 0
                    ?
                    `<div class="empty-cart">
                        <div>🛒</div>
                        <h3>Your cart is empty</h3>
                        <p>Add something delicious!</p>
                    </div>`
                    :
                    cart.map(item => `

                        <div class="cart-item">

                            <div class="cart-item-icon">
                                ${item.emoji}
                            </div>

                            <div class="cart-item-info">

                                <h4>${item.name}</h4>

                                <p>₹${item.price}</p>

                                <div class="quantity-controls">

                                    <button
                                        class="quantity-btn"
                                        data-action="minus"
                                        data-id="${item.id}">
                                        −
                                    </button>

                                    <span>
                                        ${item.quantity}
                                    </span>

                                    <button
                                        class="quantity-btn"
                                        data-action="plus"
                                        data-id="${item.id}">
                                        +
                                    </button>

                                </div>

                            </div>

                            <strong>
                                ₹${item.price * item.quantity}
                            </strong>

                        </div>

                    `).join("")
                }

            </div>


            <div class="cart-footer">

                <div class="cart-total">

                    <span>Total</span>

                    <strong>
                        ₹${total}
                    </strong>

                </div>


                ${
                    cart.length > 0
                    ?
                    `<button class="order-btn">
                        Order on WhatsApp
                    </button>`
                    :
                    ""
                }

            </div>
        `;


        // Close cart

        const closeButton =
            cartPanel.querySelector(".close-cart");

        if (closeButton) {

            closeButton.addEventListener("click", () => {
                cartPanel.classList.remove("open");
            });
        }


        // Quantity buttons

        cartPanel.querySelectorAll(".quantity-btn")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const id =
                        Number(button.dataset.id);

                    const action =
                        button.dataset.action;

                    changeQuantity(id, action);
                });
            });


        // WhatsApp order

        const orderButton =
            cartPanel.querySelector(".order-btn");

        if (orderButton) {

            orderButton.addEventListener("click", sendWhatsAppOrder);
        }
    }


    // =========================
    // CHANGE QUANTITY
    // =========================

    function changeQuantity(id, action) {

        const item = cart.find(
            product => product.id === id
        );

        if (!item) return;


        if (action === "plus") {
            item.quantity++;
        }


        if (action === "minus") {

            item.quantity--;

            if (item.quantity <= 0) {

                cart = cart.filter(
                    product => product.id !== id
                );
            }
        }

        saveCart();

        renderCart();
    }


    // =========================
    // WHATSAPP ORDER
    // =========================

    function sendWhatsAppOrder() {

        if (cart.length === 0) return;

        let message =
            "Hello Brew & Bean Café! 👋%0A%0A" +
            "I would like to order:%0A%0A";

        let total = 0;

        cart.forEach(item => {

            const itemTotal =
                item.price * item.quantity;

            total += itemTotal;

            message +=
                `${item.name} x ${item.quantity} - ₹${itemTotal}%0A`;
        });


        message +=
            `%0A*Total: ₹${total}*%0A%0A` +
            "Please confirm my order. Thank you! ☕";


        // IMPORTANT:
        // Replace this number with the real cafe WhatsApp number.

        const phoneNumber = "919876543210";

        const whatsappURL =
            `https://wa.me/${phoneNumber}?text=${message}`;

        window.open(
            whatsappURL,
            "_blank"
        );
    }


    // =========================
    // TOAST
    // =========================

    function showToast(message) {

        const oldToast =
            document.querySelector(".toast-message");

        if (oldToast) {
            oldToast.remove();
        }


        const toast =
            document.createElement("div");

        toast.className =
            "toast-message";

        toast.textContent =
            message;

        document.body.appendChild(toast);


        setTimeout(() => {
            toast.classList.add("show");
        }, 50);


        setTimeout(() => {

            toast.classList.remove("show");

            setTimeout(() => {
                toast.remove();
            }, 300);

        }, 2500);
    }


    // =========================
    // NAVBAR SCROLL
    // =========================

    const navbar =
        document.querySelector(".navbar");

    window.addEventListener("scroll", () => {

        if (!navbar) return;

        if (window.scrollY > 30) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });


    // =========================
    // INITIAL CART
    // =========================

    updateCart();

});