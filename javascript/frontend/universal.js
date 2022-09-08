import { addNewMenuCard } from "../frontend/menu/new_menu_card.js";

class UniversalPageControls {
  constructor() {
    this.hamburgerMenu = document.querySelector("#hamburger-menu");
    this.darkenScreen = document.querySelector("#darken-screen");
    this.mobileMenuList = document.querySelector("#mobile-menu__list");
    this.mobileMenuListSite = document.querySelector("#mobile-menu__list-site");
    this.darkMobileMenuOverlay = document.querySelector("#darken-screen");
    this.hamburgerStatus = false;
    this.addMenuCard = document.querySelector("#add-menu-card");
    this.menuCardContainer = document.querySelector("#menu-cards");
  }

  addHamburgerMenuInteractions() {
    this.darkenScreen.addEventListener("click", (e) => {
      this.hamburgerMenu.click();
    });

    this.hamburgerMenu.addEventListener("click", (e) => {
      if (!this.hamburgerStatus) {
        this.hamburgerMenu.classList.add("active");
        this.darkenScreen.classList.add("active");
        this.mobileMenuList.classList.add("active");
        this.mobileMenuListSite.classList.add("active");
      }
      if (this.hamburgerStatus) {
        this.hamburgerMenu.classList.remove("active");
        this.darkenScreen.classList.remove("active");
        this.mobileMenuList.classList.remove("active");
        this.mobileMenuListSite.classList.remove("active");
      }

      this.hamburgerStatus = !this.hamburgerStatus;
    });

    this.mobileMenuList.addEventListener("click", () => {
      return;
    });

    ///////////////////////////
    //Add the "Add" button functions in
    if (this.addMenuCard) {
      this.addMenuCard.addEventListener("click", (e) => {
        addNewMenuCard(
          Array.from(document.querySelectorAll("[data-card]")),
          this.menuCardContainer,
          this.hamburgerMenu
        );
      });
    }
  }
}

const pageControls = new UniversalPageControls();
pageControls.addHamburgerMenuInteractions();
