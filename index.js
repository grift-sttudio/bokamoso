"use strict";

document.addEventListener("DOMContentLoaded", function () {

  /*
    GET THE LEARNER NUMBER FROM THE URL.

    Example:
    index.html?learner=1
    index.html?learner=2
  */

  const params =
    new URLSearchParams(
      window.location.search
    );

  const learnerId =
    params.get("learner") || "default";

  /*
    EVERY LEARNER NOW GETS
    THEIR OWN STORAGE.

    Example:
    bokamosoLearner_1
    bokamosoLearner_2
  */

  const STORAGE_KEY =
    "bokamosoLearner_" + learnerId;


  const tutorName =
    document.getElementById("tutorName");

  const grade =
    document.getElementById("grade");

  const date =
    document.getElementById("date");

  const studentName =
    document.getElementById("studentName");


  const progressCircle =
    document.getElementById("progressCircle");

  const progressText =
    document.getElementById("progressText");

  const progressOptions =
    document.getElementById("progressOptions");

  const colorOptions =
    document.querySelectorAll(".color-option");


  const itemName =
    document.getElementById("itemName");

  const quantity =
    document.getElementById("quantity");

  const recordedDate =
    document.getElementById("recordedDate");


  const addItemBtn =
    document.getElementById("addItemBtn");

  const saveBtn =
    document.getElementById("saveBtn");

  const clearBtn =
    document.getElementById("clearBtn");


  const itemsList =
    document.getElementById("itemsList");

  const totalItems =
    document.getElementById("totalItems");

  const message =
    document.getElementById("message");


  let progressStatus = "none";

  let items = [];


  /*
    LOAD LEARNER INFORMATION
    FROM THE CLASSLIST
  */

  function loadClasslistLearner() {

    if (learnerId === "default") {
      return;
    }

    let classData = {};

    try {

      classData =
        JSON.parse(
          localStorage.getItem(
            "classlistData"
          ) || "{}"
        );

    }
    catch (error) {

      classData = {};

    }


    if (classData.tutorName) {
      tutorName.value =
        classData.tutorName;
    }


    if (classData.grade) {
      grade.value =
        classData.grade;
    }


    if (
      Array.isArray(
        classData.students
      )
    ) {

      const learner =
        classData.students.find(
          function (student) {
            return String(student.id) ===
              String(learnerId);
          }
        );


      if (
        learner &&
        learner.name
      ) {

        studentName.value =
          learner.name;

      }

    }

  }


  /*
    PROGRESS
  */

  function applyProgress(status) {

    progressStatus = status;


    progressCircle.classList.remove(
      "none",
      "good",
      "average",
      "poor"
    );


    progressCircle.classList.add(
      status
    );


    if (status === "good") {

      progressText.textContent =
        "GOOD";

    }

    else if (
      status === "average"
    ) {

      progressText.textContent =
        "AVG";

    }

    else if (
      status === "poor"
    ) {

      progressText.textContent =
        "POOR";

    }

    else {

      progressText.textContent =
        "?";

    }

  }


  progressCircle.addEventListener(
    "click",
    function () {

      progressOptions.classList.toggle(
        "hidden"
      );

    }
  );


  colorOptions.forEach(
    function (option) {

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

        }
      );

    }
  );


  /*
    CART
  */

  function renderItems() {

    itemsList.innerHTML = "";


    items.forEach(
      function (item, index) {

        const row =
          document.createElement("div");

        row.className =
          "item-row";


        if (item.purchased) {

          row.classList.add(
            "purchased"
          );

        }


        const checkbox =
          document.createElement(
            "input"
          );

        checkbox.type =
          "checkbox";

        checkbox.className =
          "item-check";

        checkbox.checked =
          item.purchased;


        checkbox.addEventListener(
          "change",
          function () {

            items[index].purchased =
              checkbox.checked;

            saveSilently();

            renderItems();

          }
        );


        const info =
          document.createElement(
            "div"
          );

        info.className =
          "item-info";


        const itemTitle =
          document.createElement(
            "strong"
          );

        itemTitle.className =
          "item-name";

        itemTitle.textContent =
          item.name;


        const details =
          document.createElement(
            "small"
          );


        let detailsText =
          "Qty: " +
          item.quantity;


        if (item.recordedDate) {

          detailsText +=
            " | Recorded: " +
            item.recordedDate;

        }


        details.textContent =
          detailsText;


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


        info.appendChild(
          itemTitle
        );

        info.appendChild(
          details
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


  /*
    ADD ITEM
  */

  function addItem() {

    const nameValue =
      itemName.value.trim();


    let quantityValue =
      Number(
        quantity.value
      );


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

      name:
        nameValue,

      quantity:
        quantityValue,

      recordedDate:
        recordedDateValue,

      purchased:
        false

    });


    itemName.value = "";

    quantity.value = "1";

    recordedDate.value = "";

    itemName.focus();


    saveSilently();

    renderItems();

  }


  /*
    GET CURRENT LEARNER DATA
  */

  function getData() {

    return {

      learnerId:
        learnerId,

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


  /*
    SAVE THIS LEARNER ONLY
  */

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
      "Learner " +
      learnerId +
      " saved successfully."
    );

  }


  /*
    LOAD THIS LEARNER ONLY
  */

  function loadAll() {

    let data = {};


    try {

      data =
        JSON.parse(
          localStorage.getItem(
            STORAGE_KEY
          ) || "{}"
        );

    }

    catch (error) {

      data = {};

    }


    /*
      IF THIS LEARNER HAS
      NEVER BEEN SAVED BEFORE,
      GET THEIR NAME/GRADE/TUTOR
      FROM THE CLASSLIST.
    */

    if (
      Object.keys(data).length === 0
    ) {

      loadClasslistLearner();

      applyProgress(
        "none"
      );

      items = [];

      renderItems();

      return;

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

    }

    else {

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

    }

    else {

      items = [];

    }


    renderItems();

  }


  /*
    CLEAR ONLY THIS LEARNER
  */

  function clearAll() {

    const confirmed =
      window.confirm(
        "Clear this learner's progress and items?"
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


    /*
      PUT THEIR CLASSLIST
      INFORMATION BACK AFTER
      CLEARING PROGRESS.
    */

    loadClasslistLearner();


    showMessage(
      "Learner cleared."
    );

  }


  function showMessage(text) {

    message.textContent =
      text;


    window.clearTimeout(
      showMessage.timer
    );


    showMessage.timer =
      window.setTimeout(
        function () {

          message.textContent =
            "";

        },
        2200
      );

  }


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


  loadAll();

});