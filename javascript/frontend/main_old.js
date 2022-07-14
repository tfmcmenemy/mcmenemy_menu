// const e = require("express");
import { addNewMenuCard } from "./new_menu_card.js";

const menuCardContainer = document.querySelector("#menu-cards");
const menuCards = Array.from(document.querySelectorAll("[data-card]"));
const saveButtons = document.querySelectorAll(".save-button");
const addMenuCard = document.querySelector("#add-menu-card");

const originalInputs = [];
const inputChanges = [];
//Adds front end interactions to the menu cards
menuCards.forEach((card) => {
  let cardNumber = card.dataset["card"];

  let homeOrNo = card.querySelector(`#card-tom-home-checkbox-${cardNumber}`);
  let timeHome = card.querySelector(`#card-time-home-${cardNumber}`);
  let addSide = card.querySelector(`#add-side-${cardNumber}`);
  let notes = card.querySelector(`#card-notes-${cardNumber}`);
  let allInputs = card.querySelectorAll(`input, textarea`);
  originalInputs.push({ card: cardNumber });

  //Function that actually adds the save button
  let addSaveButton = function (card) {
    if (!card.classList.contains("save-button-added")) {
      card.classList.add("save-button-added");
      card.querySelector(".save-button").classList.add("show");
    }
  };

  //Adds a change notification to the card so that a save button can populate.
  Array.from(allInputs).forEach((input) => {
    //Collect the original entries for each card
    input.type == "checkbox"
      ? (originalInputs[cardNumber - 1][input.dataset.type] = input.checked)
      : (originalInputs[cardNumber - 1][input.dataset.type] = input.value);

    //Adds an eventlistener that triggers when an input field is changed.
    if (input.type != "checkbox") {
      //For the inputs that are not a checkbox
      input.addEventListener("blur", (e) => {
        //The 'blur' event listener is when the input is exited.
        let originalEntry = e.target.dataset.originalEntry;
        if (e.target.value.toLowerCase() == originalEntry.toLowerCase()) return;
        inputChanges.push({
          card: e.target.closest(".menu-card").dataset.card,
          changed: e.target.dataset.type,
        });
        addSaveButton(e.target.closest(".menu-card"));
      });
    } else {
      //For the checkbox inputs
      input.addEventListener("change", (e) => {
        inputChanges.push({
          card: e.target.closest(".menu-card").dataset.card,
          changed: e.target.dataset.type,
        });
        addSaveButton(e.target.closest(".menu-card"));
      });
    }
  });

  //Adds the ability to enable or disable the time home field based on the checkbox

  let setTextInTomHomeField = function (target) {
    if (target.checked) {
      timeHome.nextElementSibling.style.fontSize = "14px";
      timeHome.closest(".input-group").classList.add("disabled");
      timeHome.disabled = true;
      setTimeout(() => {
        timeHome.nextElementSibling.innerText = "Not Home";
      }, 250);

      timeHome.value = "";
    } else {
      timeHome.closest(".input-group").classList.remove("disabled");
      timeHome.disabled = false;
      timeHome.nextElementSibling.innerText = "Time";
      timeHome.nextElementSibling.style.fontSize = "inherit";
    }
  };
  setTextInTomHomeField(homeOrNo);
  homeOrNo.addEventListener("change", (e) => {
    setTextInTomHomeField(e.target);
  });

  let sideNumber = 1;

  addSide.addEventListener("click", (e) => {
    let addButton = e.target.closest(".circle-button");
    let currentSide = e.target.closest(".input-group");
    let newSide = document.createElement("div");
    let parent = e.target.closest(".card-sides");
    let classesToAdd = ["input-group", "whole-width", "close-top-margin"];

    classesToAdd.forEach((cls) => newSide.classList.add(cls));

    newSide.innerHTML = `<input type="text" id="card-side-1-${
      sideNumber + 1
    }" class="card-input indent-left" placeholder=" "
                                autocomplete="off" data-type="side">
                            <label for="card-side-1-${
                              sideNumber + 1
                            }" class="card-label indent-left">Side
                            </label>`;

    newSide.append(addButton);
    sideNumber++;

    parent.insertAdjacentElement("afterbegin", newSide);

    parent.querySelector("input").focus();

    addSaveButton(e.target.closest(".menu-card"));
  });

  //Adding scroll to the top for when the user exits editing the notes.
  notes.addEventListener("blur", (e) => {
    e.target.scrollTop = 0;
  });
});

///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
//Adds the functionality to the hamburger menu
let hamburgerMenu = document.querySelector("#hamburger-menu");
let darkenScreen = document.querySelector("#darken-screen");
let mobileMenuList = document.querySelector("#mobile-menu__list");
let hamburgerStatus = false;

hamburgerMenu.addEventListener("click", (e) => {
  if (!hamburgerStatus) {
    hamburgerMenu.classList.add("active");
    darkenScreen.classList.add("active");
    mobileMenuList.classList.add("active");
  }
  if (hamburgerStatus) {
    hamburgerMenu.classList.remove("active");
    darkenScreen.classList.remove("active");
    mobileMenuList.classList.remove("active");
  }

  hamburgerStatus = !hamburgerStatus;
});

mobileMenuList.addEventListener("click", () => {
  return;
});

let x = originalInputs.filter((item) => item.card == 1);

///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
//Adding the save button functionality
Array.from(saveButtons).forEach((button) => {
  button.addEventListener("click", (e) => {
    //Get the data from the card that the save button was clicked on
    let parentCard = button.closest(".menu-card");
    let mealID = parentCard.dataset.mealId;
    let entree = parentCard.querySelector(
      `#card-meal-${parentCard.dataset.card}`
    ).value;
    let tomHome = !parentCard.querySelector(
      `#card-tom-home-checkbox-${parentCard.dataset.card}`
    ).checked;
    let timeHome = parentCard.querySelector(
      `#card-time-home-${parentCard.dataset.card}`
    ).value;
    let date = parentCard.querySelector(
      `#card-date-${parentCard.dataset.card}`
    ).value;
    let conflicts = parentCard.querySelector(
      `#card-other-activities-${parentCard.dataset.card}`
    ).value;
    let notes = parentCard.querySelector(
      `#card-notes-${parentCard.dataset.card}`
    ).value;
    let sides = convertArrayToPostgresArray(
      Array.from(
        parentCard
          .querySelector(`#card-sides-${parentCard.dataset.card}`)
          .querySelectorAll("input")
      ).map((side) => side.value)
    );

    //Send that data to the server in order to save it to the database
    //maybe make an await function to show the user what is happening
    fetch(
      `/save?mealID=${mealID}&entree=${entree}&tomHome=${tomHome}&timehome=${timeHome}&date=${
        date || "1900-01-01"
      }&conflicts=${conflicts}&notes=${notes}&sides=${sides}`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(`There was an error!!`));
  });
});

///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
//Helper functions
const convertArrayToPostgresArray = function (arr) {
  return "{".concat(arr.join(", "), "}");
};

///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
//Adding a menu card
addMenuCard.addEventListener("click", (e) => {
  addNewMenuCard(
    Array.from(document.querySelectorAll("[data-card]")),
    menuCardContainer,
    hamburgerMenu
  );
});

class MenuCardFrontEnd {
  constructor() {}
}
