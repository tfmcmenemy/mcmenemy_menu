// const e = require("express");
import { MenuCardFrontEnd } from "../menu/menuCardFrontEnd.js";

//Menu page
const menuFrontend = new MenuCardFrontEnd();
menuFrontend.addFrontEndInteractions();

document.querySelector(".menu-cards").addEventListener("click", (e) => {
  window.scrollTo(0, 0);
});
