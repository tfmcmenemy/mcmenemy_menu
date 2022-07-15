import { addNewMenuCard } from "./new_menu_card.js";
import { DatabaseConnections } from "../model/model.js";
const DatabaseConnection = new DatabaseConnections();

class MenuCardFrontEnd {
  constructor() {
    this.menuCardContainer = document.querySelector("#menu-cards");
    this.addMenuCard = document.querySelector("#add-menu-card");
    this.hamburgerMenu = document.querySelector("#hamburger-menu");
    this.darkenScreen = document.querySelector("#darken-screen");
    this.mobileMenuList = document.querySelector("#mobile-menu__list");
    this.hamburgerStatus = false;
  }

  addFrontEndInteractions() {
    this.menuCards = Array.from(document.querySelectorAll("[data-card]"));
    this.saveButtons = document.querySelectorAll(".save-button");

    this.menuCards.forEach((card) => {
      let cardNumber = card.dataset["card"];

      let homeOrNo = card.querySelector(
        `#card-tom-home-checkbox-${cardNumber}`
      );
      let timeHome = card.querySelector(`#card-time-home-${cardNumber}`);
      let addSide = card.querySelector(`#add-side-${cardNumber}`);
      let notes = card.querySelector(`#card-notes-${cardNumber}`);
      let allInputs = card.querySelectorAll(`input, textarea`);
      // this.originalInputs.push({ card: cardNumber });

      /////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////
      //Adds a change notification to the card so that a save button can populate.
      Array.from(allInputs).forEach((input) => {
        //Adds an eventlistener that triggers when an input field is changed.
        if (input.type != "checkbox") {
          //For the inputs that are not a checkbox
          input.addEventListener("blur", (e) => {
            //The 'blur' event listener is when the input is exited.
            let originalEntry = e.target.dataset.originalEntry;
            if (e.target.value.toLowerCase() == originalEntry.toLowerCase())
              return;

            this.addSaveButton(e.target.closest(".menu-card"));
          });
        } else {
          //For the checkbox inputs
          input.addEventListener("change", (e) => {
            this.addSaveButton(e.target.closest(".menu-card"));
          });
        }
      });
      /////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////
      //Adds the ability to enable or disable the time home field based on the checkbox
      {
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
      }
      /////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////
      //Controls the front end interactions with adding new sides.
      {
        let sideNumber = 1;
        addSide = this.refreshNode(addSide);
        addSide.addEventListener("click", (e) => {
          let addButton = e.target.closest(".circle-button");
          let currentSide = e.target.closest(".input-group");
          let newSide = document.createElement("div");
          let parent = e.target.closest(".card-sides");
          let classesToAdd = ["input-group", "whole-width", "close-top-margin"];
          let cardNumber = e.target.closest(".menu-card").dataset.mealID;

          classesToAdd.forEach((cls) => newSide.classList.add(cls));

          newSide.innerHTML = `<input type="text" id="card-side-${cardNumber}-${
            sideNumber + 1
          }" class="card-input indent-left" placeholder=" "
                                autocomplete="off" data-type="side">
                            <label for="card-side-${cardNumber}-${
            sideNumber + 1
          }" class="card-label indent-left">Side
                            </label>`;

          newSide.append(addButton);
          sideNumber++;

          parent.insertAdjacentElement("afterbegin", newSide);

          parent.querySelector("input").focus();

          this.addSaveButton(e.target.closest(".menu-card"));
        });
      }

      //Adding scroll to the top for when the user exits editing the notes.
      notes.addEventListener("blur", (e) => {
        e.target.scrollTop = 0;
      });
    });

    this.addSaveButtonsFunctionality();
    this.removeTomHomeLabel();
  }

  addHamburgerMenuInteractions() {
    this.hamburgerMenu.addEventListener("click", (e) => {
      if (!this.hamburgerStatus) {
        this.hamburgerMenu.classList.add("active");
        this.darkenScreen.classList.add("active");
        this.mobileMenuList.classList.add("active");
      }
      if (this.hamburgerStatus) {
        this.hamburgerMenu.classList.remove("active");
        this.darkenScreen.classList.remove("active");
        this.mobileMenuList.classList.remove("active");
      }

      this.hamburgerStatus = !this.hamburgerStatus;
    });

    this.mobileMenuList.addEventListener("click", () => {
      return;
    });

    ///////////////////////////
    //Add the "Add" button functions in
    this.addMenuCard.addEventListener("click", (e) => {
      addNewMenuCard(
        Array.from(document.querySelectorAll("[data-card]")),
        this.menuCardContainer,
        this.hamburgerMenu
      );
      this.addFrontEndInteractions();
      // let scrollToPosition = this.menuCardContainer.lastChild
      //   .querySelector("input")
      //   .getBoundingClientRect().bottom;
      // console.log(`The scroll to position is ${scrollToPosition}`);
      // // window.scroll(0, scrollToPosition);
    });
  }

  addSaveButtonsFunctionality() {
    Array.from(this.saveButtons).forEach((button) => {
      button = this.refreshNode(button);
      button.addEventListener("click", (e) => {
        DatabaseConnection.save(button);
        this.removeSaveButton(button.closest(".menu-card"));
      });
    });
  }

  addSaveButton(card) {
    if (!card.classList.contains("save-button-added")) {
      card.classList.add("save-button-added");
      card.querySelector(".save-button").classList.add("show");
    }
  }

  removeSaveButton(card) {
    if (card.classList.contains("save-button-added")) {
      card.classList.remove("save-button-added");
      card.querySelector(".save-button").classList.remove("show");
    }
  }

  refreshNode(node) {
    let oldElement = node;
    let newElement = oldElement.cloneNode(true);
    oldElement.parentNode.replaceChild(newElement, oldElement);
    return newElement;
  }

  removeTomHomeLabel() {
    let timeHomeInputs = document.querySelectorAll("[id^=card-time-home-]");

    Array.from(timeHomeInputs).forEach((input) => {
      let parentCard = input.closest(".menu-card");
      let targetElement = parentCard.querySelector("span.tom-home");
      if (input.value.length > 0) {
        targetElement.style.display = "none";
      }
    });
    Array.from(timeHomeInputs).forEach((input) =>
      input.addEventListener("focus", (e) => {
        let parentCard = e.target.closest(".menu-card");
        let targetElement = parentCard.querySelector("span.tom-home");
        targetElement.style.display = "none";
      })
    );
    Array.from(timeHomeInputs).forEach((input) =>
      input.addEventListener("blur", (e) => {
        let parentCard = e.target.closest(".menu-card");
        let targetElement = parentCard.querySelector("span.tom-home");
        if (e.target.value.length < 1) targetElement.style.display = "inline";
      })
    );
  }
}

export { MenuCardFrontEnd };
