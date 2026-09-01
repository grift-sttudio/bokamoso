"use strict";

document.addEventListener("DOMContentLoaded", function () {

  const STORAGE_KEY = "bokamosoData";


  /* TOP INFORMATION */

  const tutorName =
    document.getElementById("tutorName");

  const grade =
    document.getElementById("grade");

  const date =
    document.getElementById("date");

  const studentName =
    document.getElementById("studentName");


  /* PROGRESS */

  const progressCircle =
    document.getElementById("progressCircle");

  const progressText =
    document.getElementById("progressText");

  const progressOptions =
    document.getElementById("progressOptions");

  const colorOptions =
    document.querySelectorAll(".color-option");


  /* CART FORM */

  const itemName =
    document.getElementById("itemName");

  const quantity =
    document.getElementById("quantity");

  const recordedDate =
    document.getElementById("recordedDate");


  /* BUTTONS */

  const addItemBtn =
    document.getElementById("addItemBtn");

  const saveBtn =
    document.getElementById("saveBtn");

  const clearBtn =
    document.getElementById("clearBtn");


  /* CART */

  const itemsList =
    document.getElementById("itemsList");

  const totalItems =
    document.getElementById("totalItems");

  const message =
    document.getElementById("message");


  let progressStatus = "none";

  let items = [];


  /* =========================
     PROGRESS
  ========================= */


  function applyProgress(status) {

    progressStatus = status;

    progressCircle.classList.remove(
      "none",
      "good",
      "average",
      "poor"
    );

    progressCircle.classList.add(status);


    if (status === "good") {

      progressText.textContent = "GOOD";

    } else if (status === "average") {

      progressText.textContent = "AVG";

    } else if (status === "poor") {

      progressText.textContent = "POOR";

    } else {

      progressText.textContent = "?";

    }

  }


  /* CLICK MAIN CIRCLE */

  progressCircle.addEventListener(
    "click",
    function () {

      progressOptions.classList.toggle(
        "hidden"
      );

    }
  );


  /* CHOOSE COLOR */

  colorOptions.forEach(function (option) {

    option.addEventListener(
      "click",
      function () {

        const status =
          option.getAttribute(
            "data-status"
          );

        applyProgress(status);

        progressOptions.classList.add(
          "hidden"
        );

        saveSilently();

      }
    );

  });


  /* =========================
     CART
  ========================= */


  function renderItems() {

    itemsList.innerHTML = "";


    items.forEach(
      function (item, index) {

        const row =
          document.createElement("div");

        row.className = "item-row";


        if (item.purchased) {

          row.classList.add(
            "purchased"
          );

        }


        /* CHECKBOX */

        const checkbox =
          document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className =
          "item-check";

        checkbox.checked =
          Boolean(item.purchased);


        checkbox.addEventListener(
          "change",
          function () {

            items[index].purchased =
              checkbox.checked;

            saveSilently();

            renderItems();

          }
        );


        /* ITEM INFO */

        const info =
          document.createElement("div");

        info.className = "item-info";


        const title =
          document.createElement("strong");

        title.className = "item-name";

        title.textContent =
          item.name;


        const details =
          document.createElement("small");


        let text =
          "Qty: " + item.quantity;


        if (item.recordedDate) {

          text +=
            " | Recorded: " +
            item.recordedDate;

        }


        details.textContent = text;


        info.appendChild(title);

        info.appendChild(details);


        /* DELETE BUTTON */

        const deleteButton =
          document.createElement(
            "button"
          );

        deleteButton.type =
          "button";

        deleteButton.className =
          "delete-btn";

        deleteButton.textContent =
          "✕";


        deleteButton.addEventListener(
          "click",
          function () {

            items.splice(
              index,
              1
            );

            saveSilently();

            renderItems();

          }
        );


        row.appendChild(
          checkbox
        );

        row.appendChild(
          info
        );

        row.appendChild(
          deleteButton
        );


        itemsList.appendChild(
          row
        );

      }
    );


    totalItems.textContent =
      String(items.length);

  }


  /* ADD ITEM */

  function addItem() {

    const nameValue =
      itemName.value.trim();


    let quantityValue =
      Number(quantity.value);


    const recordedDateValue =
      recordedDate.value;


    if (nameValue === "") {

      alert(
        "Please enter the name of the item."
      );

      itemName.focus();

      return;

    }


    if (
      !Number.isFinite(
        quantityValue
      ) ||
      quantityValue < 1
    ) {

      quantityValue = 1;

    }


    items.push({

      name: nameValue,

      quantity: quantityValue,

      recordedDate:
        recordedDateValue,

      purchased: false

    });


    itemName.value = "";

    quantity.value = "1";

    recordedDate.value = "";


    itemName.focus();


    saveSilently();

    renderItems();

  }


  /* =========================
     SAVE DATA
  ========================= */


  function getData() {

    return {

      tutorName:
        tutorName.value,

      grade:
        grade.value,

      date:
        date.value,

      studentName:
        studentName.value,

      progress:
        progressStatus,

      items:
        items

    };

  }


  function saveSilently() {

    localStorage.setItem(

      STORAGE_KEY,

      JSON.stringify(
        getData()
      )

    );

  }


  function saveAll() {

    saveSilently();

    showMessage(
      "Saved successfully."
    );

  }


  /* =========================
     LOAD DATA
  ========================= */


  function loadAll() {

    let data = {};


    try {

      data =
        JSON.parse(

          localStorage.getItem(
            STORAGE_KEY
          ) || "{}"

        );

    } catch (error) {

      data = {};

    }


    tutorName.value =
      data.tutorName || "";


    grade.value =
      data.grade || "";


    date.value =
      data.date || "";


    studentName.value =
      data.studentName || "";


    if (
      data.progress === "good" ||
      data.progress === "average" ||
      data.progress === "poor"
    ) {

      applyProgress(
        data.progress
      );

    } else {

      applyProgress(
        "none"
      );

    }


    if (
      Array.isArray(
        data.items
      )
    ) {

      items =
        data.items;

    } else {

      items = [];

    }


    renderItems();

  }


  /* =========================
     CLEAR
  ========================= */


  function clearAll() {

    const confirmed =
      window.confirm(
        "Are you sure you want to clear everything?"
      );


    if (!confirmed) {

      return;

    }


    localStorage.removeItem(
      STORAGE_KEY
    );


    tutorName.value = "";

    grade.value = "";

    date.value = "";

    studentName.value = "";


    itemName.value = "";

    quantity.value = "1";

    recordedDate.value = "";


    items = [];


    applyProgress(
      "none"
    );


    renderItems();


    showMessage(
      "Cleared."
    );

  }


  /* =========================
     MESSAGE
  ========================= */


  function showMessage(text) {

    message.textContent =
      text;


    window.clearTimeout(
      showMessage.timer
    );


    showMessage.timer =
      window.setTimeout(
        function () {

          message.textContent = "";

        },
        2200
      );

  }


  /* =========================
     EVENTS
  ========================= */


  addItemBtn.addEventListener(
    "click",
    addItem
  );


  saveBtn.addEventListener(
    "click",
    saveAll
  );


  clearBtn.addEventListener(
    "click",
    clearAll
  );


  /* PRESS ENTER TO ADD ITEM */

  itemName.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Enter"
      ) {

        event.preventDefault();

        addItem();

      }

    }
  );


  /* START */

  loadAll();

});