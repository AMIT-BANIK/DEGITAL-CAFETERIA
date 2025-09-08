const order = {};
const summaryList = document.getElementById("summary-list");
const summaryPrice = document.getElementById("summary-price");
const pOrderBtn = document.getElementById("pOrder");

//pOrderBtn.parentNode.insertBefore(exitBtn, pOrderBtn.nextSibling);

function attachMenuListeners() {
  document.querySelectorAll(".increase").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price);

      if (!order[name]) order[name] = { qty: 0, price };
      order[name].qty++;
      updateQtyDisplay(name);
      updateSummary();
    });
  });

  document.querySelectorAll(".decrease").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      if (order[name] && order[name].qty > 0) {
        order[name].qty--;
        updateQtyDisplay(name);
        updateSummary();
      }
    });
  });
}

function updateQtyDisplay(name) {
  const qtyEl = document.querySelector(`.qty[data-name="${name}"]`);
  if (qtyEl) qtyEl.innerText = order[name]?.qty || 0;
}

function updateSummary() {
  summaryList.innerHTML = "";
  let total = 0;
  let empty = true;

  for (const item in order) {
    if (order[item].qty > 0) {
      empty = false;
      const li = document.createElement("li");
      li.classList.add("order-item");
      li.innerHTML = `${item} x ${order[item].qty} <span>Tk ${order[item].qty * order[item].price}</span>`;
      summaryList.appendChild(li);
      total += order[item].qty * order[item].price;
    }
  }

  if (empty) {
    summaryList.innerHTML = "<li>No items selected</li>";
  }

  summaryPrice.innerText = `Tk ${total}`;
}

// Exit button handler
exitBtn.addEventListener("click", () => {
  updateSummary(); // restore order summary
  pOrderBtn.style.display = "block"; // show Place Order again
  exitBtn.style.display = "none"; // hide Exit
});

// Place order workflow
pOrderBtn.addEventListener("click", () => {
  if (summaryPrice.innerText === "Tk 0") return alert("Please select some items first!");

  // Swap buttons
  pOrderBtn.style.display = "none";
  exitBtn.style.display = "block";

  summaryList.innerHTML = `
    <li>Enter your phone number:</li>
    <li><input type="text" id="phone-input" placeholder="01XXXXXXXXX"/></li>
    <li><button id="phone-submit">Submit</button></li>
  `;

  document.getElementById("phone-submit").addEventListener("click", () => {
    const phone = document.getElementById("phone-input").value.trim();
    if (!/^01\d{9}$/.test(phone)) return alert("Invalid phone number!");

    summaryList.innerHTML = `
      <li>OTP sent to ${phone}</li>
      <li><input type="text" id="otp-input" placeholder="Enter OTP (Demo: 1234)"/></li>
      <li><button id="otp-submit">Submit OTP</button></li>
    `;

    document.getElementById("otp-submit").addEventListener("click", () => {
      const otp = document.getElementById("otp-input").value.trim();
      if (otp !== "1234") return alert("Invalid OTP! (Demo: 1234)");

      summaryList.innerHTML = `
        <li>Enter your Bkash PIN:</li>
        <li><input type="password" id="pin-input" placeholder="Enter PIN (Demo: 0000)"/></li>
        <li><button id="pin-submit">Submit PIN</button></li>
      `;

      document.getElementById("pin-submit").addEventListener("click", () => {
        const pin = document.getElementById("pin-input").value.trim();
        if (pin !== "0000") return alert("Incorrect PIN! (Demo: 0000)");

        showFinalOrder();
      });
    });
  });
});

function showFinalOrder() {
  const orderCode = "SUST" + Math.floor(Math.random() * 9000 + 1000);
  summaryList.innerHTML = "";

  const successBanner = document.createElement("li");
  successBanner.classList.add("success-banner");
  successBanner.innerText = "Payment Successful ✅";
  summaryList.appendChild(successBanner);

  let total = 0;
  for (const item in order) {
    if (order[item].qty > 0) {
      const li = document.createElement("li");
      li.classList.add("order-item");
      li.innerHTML = `${item} x ${order[item].qty} <span>Tk ${order[item].qty * order[item].price}</span>`;
      summaryList.appendChild(li);
      total += order[item].qty * order[item].price;
    }
  }

  const totalLi = document.createElement("li");
  totalLi.classList.add("order-code");
  totalLi.innerHTML = `<strong>Total:</strong> Tk ${total}`;
  summaryList.appendChild(totalLi);

  const orderCodeLi = document.createElement("li");
  orderCodeLi.classList.add("order-code");
  orderCodeLi.innerHTML = `<strong>Order Code:</strong> ${orderCode}`;
  summaryList.appendChild(orderCodeLi);

  summaryPrice.innerText = `Tk ${total}`;


  pOrderBtn.style.display = "none";
  exitBtn.style.display = "block";
}


attachMenuListeners();
