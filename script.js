function calculateItemAmount(price, quantity) {
  return price * quantity;
}

function calculateDiscount(subtotal) {
  let discountRate;

  if (subtotal >= 5000) {
    discountRate = 0.10;
  } else if (subtotal >= 3000) {
    discountRate = 0.07;
  } else if (subtotal >= 1000) {
    discountRate = 0.05;
  } else {
    discountRate = 0;
  }

  return subtotal * discountRate;
}

function getDeliveryFee(option) {
  let fee;

  switch (Number(option)) {
    case 1:
      fee = 0;
      break;
    case 2:
      fee = 80;
      break;
    case 3:
      fee = 150;
      break;
    default:
      fee = 0;
  }

  return fee;
}

function formatCurrency(amount) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function generateProductFields() {
  const productCount =
    Number(document.getElementById("productCount").value);

  const productsContainer =
    document.getElementById("productsContainer");

  productsContainer.innerHTML = "";

  if (!Number.isFinite(productCount) || productCount <= 0) {
    return;
  }

  for (let i = 0; i < productCount; i++) {
    const block = document.createElement("div");

    block.className = "product-block";

    block.innerHTML = `
      <label for="productName-${i}">Product Name</label>
      <input type="text" id="productName-${i}">

      <label for="productPrice-${i}">Price</label>
      <input type="number" id="productPrice-${i}" step="0.01">

      <label for="productQuantity-${i}">Quantity</label>
      <input type="number" id="productQuantity-${i}" step="1">
    `;

    productsContainer.appendChild(block);
  }
}

function handleCalculateOrder() {
  const customerNameElement =
    document.getElementById("customerName");

  const productCountElement =
    document.getElementById("productCount");

  const deliveryOptionElement =
    document.getElementById("deliveryOption");

  const validationMessage =
    document.getElementById("validationMessage");

  const orderSummary =
    document.getElementById("orderSummary");

  const customerName =
    customerNameElement.value.trim();

  const productCount =
    Number(productCountElement.value);

  const deliveryOption =
    Number(deliveryOptionElement.value);

  validationMessage.textContent = "";
  orderSummary.textContent = "";

  if (customerName === "") {
    validationMessage.textContent =
      "Customer name is required.";
    return;
  }

  if (!Number.isFinite(productCount) || productCount <= 0) {
    validationMessage.textContent =
      "Please enter a valid number of products.";
    return;
  }

  let fieldsMissing = false;

  for (let i = 0; i < productCount; i++) {
    const nameField =
      document.getElementById(`productName-${i}`);

    const priceField =
      document.getElementById(`productPrice-${i}`);

    const quantityField =
      document.getElementById(`productQuantity-${i}`);

    if (!nameField || !priceField || !quantityField) {
      fieldsMissing = true;
      break;
    }
  }

  if (fieldsMissing) {
    generateProductFields();
  }

  let subtotal = 0;
  let productDetails = "";

  for (let i = 0; i < productCount; i++) {
    const nameField =
      document.getElementById(`productName-${i}`);

    const priceField =
      document.getElementById(`productPrice-${i}`);

    const quantityField =
      document.getElementById(`productQuantity-${i}`);

    if (!nameField || !priceField || !quantityField) {
      validationMessage.textContent =
        "Product fields are missing.";
      return;
    }

    const name =
      nameField.value.trim();

    const price =
      Number(priceField.value);

    const quantity =
      Number(quantityField.value);

    if (name === "") {
      validationMessage.textContent =
        `Product ${i + 1}: name is required.`;
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      validationMessage.textContent =
        `Product ${i + 1}: price must be a valid positive number.`;
      return;
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      validationMessage.textContent =
        `Product ${i + 1}: quantity must be a valid positive number.`;
      return;
    }

    const amount =
      calculateItemAmount(price, quantity);

    subtotal += amount;

    productDetails +=
      `${i + 1}. ${name}\n` +
      `   Price: ₱${formatCurrency(price)}\n` +
      `   Quantity: ${quantity}\n` +
      `   Amount: ₱${formatCurrency(amount)}\n\n`;
  }

  const discountAmount =
    calculateDiscount(subtotal);

  let discountRate;

  if (subtotal >= 5000) {
    discountRate = 10;
  } else if (subtotal >= 3000) {
    discountRate = 7;
  } else if (subtotal >= 1000) {
    discountRate = 5;
  } else {
    discountRate = 0;
  }

  const deliveryFee =
    getDeliveryFee(deliveryOption);

  let deliveryType;

  switch (deliveryOption) {
    case 1:
      deliveryType = "Store Pickup";
      break;
    case 2:
      deliveryType = "Standard Delivery";
      break;
    case 3:
      deliveryType = "Express Delivery";
      break;
    default:
      deliveryType = "Store Pickup";
  }

  const finalAmount =
    subtotal - discountAmount + deliveryFee;

  orderSummary.textContent =
    `MINI STORE CHECKOUT SYSTEM\n\n` +
    `Customer: ${customerName}\n\n` +
    `${productDetails}` +
    `ORDER SUMMARY\n` +
    `Subtotal: ₱${formatCurrency(subtotal)}\n` +
    `Discount Rate: ${discountRate}%\n` +
    `Discount Amount: ₱${formatCurrency(discountAmount)}\n` +
    `Delivery Type: ${deliveryType}\n` +
    `Delivery Fee: ₱${formatCurrency(deliveryFee)}\n` +
    `Final Amount: ₱${formatCurrency(finalAmount)}`;
}


// Browser code
if (typeof document !== "undefined") {
  const productCount =
    document.getElementById("productCount");

  const calculateBtn =
    document.getElementById("calculateBtn");

  if (productCount) {
    productCount.addEventListener(
      "input",
      generateProductFields
    );

    productCount.addEventListener(
      "change",
      generateProductFields
    );
  }

  if (calculateBtn) {
    calculateBtn.addEventListener(
      "click",
      handleCalculateOrder
    );
  }
}


// Node.js support for the autograder
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    calculateItemAmount,
    calculateDiscount,
    getDeliveryFee
  };
}
