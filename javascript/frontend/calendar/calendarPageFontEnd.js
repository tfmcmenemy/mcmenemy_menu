import { NewCalendarPuc } from "../calendar/newRow.js";
import { EditCalendarDay } from "../calendar/editCalendarDay.js";

//DEFINITIONS
//PUC: The small calendar day that you can click on. Similar to each day in a typical calendar. This term comes from when I worked in SOCS, we used to call each individual day a PUC.

class CalendarPageFrontEnd {
  constructor() {}

  addMobileMenuInteractions() {
    //Once the calendar page is navigated to, this will enable the hamburger buttons.
    let hamburgerMenu = document.querySelector("#hamburger-menu");
    let addNewPucButton = document.querySelector("#add-days"); //<--This is the button on the hamburger menu that allows the user to add days.
    addNewPucButton.addEventListener("click", (e) => {
      this.addDaysToCalendar();
      this.addInteractionsToDayCards(); //Adds click events to the pucs.
      hamburgerMenu.click(); // Clicks the hamburger menu to close it again.
    });
  }

  addInteractionsToDayCards() {
    //Declare variables that will need to be re-declared when adding more days and rows.
    let dayCards = Array.from(document.querySelectorAll(".calendar_day"));

    dayCards.forEach((card) => {
      //in order to prevent several event listeners from being added to
      //one element, I add a data label telling me if i already added one or not.
      if (card.dataset.listener == "yes") return;
      card.dataset.listener = "yes";

      //Each time a day card is clicked.
      card.addEventListener("click", (e) => {
        //Below will clone the card that ahs been clicked, then it will
        //expand the new element and make it as if the card that was clicked
        //on is expanding and giving more options.
        let originalPuc = e.target.closest(".calendar_day");
        let dayCardBackdrop = document.createElement("div");
        let dayCard = e.target.closest(".calendar_day");
        let newDayCard = dayCard.cloneNode(true);
        let calendar = e.target.closest(".calendar");
        dayCardBackdrop.classList.add("day-card-backdrop");
        newDayCard.classList.add("selected");
        let insertedBackdrop = calendar.insertAdjacentElement(
          "afterbegin",
          dayCardBackdrop
        );

        this.createEditButton(newDayCard, originalPuc); //This will create the pencil SVG on the card to allow for edits. the original puc that is added is passed into this function so that it can then be passed onto more functions that require it.
        insertedBackdrop.insertAdjacentElement("afterbegin", newDayCard);

        newDayCard.classList.add("selected");

        //if the backdrop is clicked when the calendar day is in view mode, then calendar day will close.
        insertedBackdrop.addEventListener("click", (e) => {
          if (!e.target.classList.contains("day-card-backdrop")) return;
          setTimeout(() => {
            //a timer starts so that the user can see the animation
            if (!e.target.classList.contains("day-card-backdrop")) return;
            e.target.closest(".day-card-backdrop").remove();
          }, 350);

          //sets the CSS properties to hide the expanded card.
          newDayCard.style.transition = ".35s";
          newDayCard.style.overflow = "hidden";
          newDayCard.style.transform = "translate(-50%, -50%) scale(1%)";
        });
      });
    });
  }

  addDaysToCalendar() {
    let calendar = document.querySelector(".calendar");
    let newPuc = new NewCalendarPuc();
    let modal = document.querySelector(".add-days-modal");
    let modalInput = document.querySelector("#add-days-input");

    //Create the save button to be added to the form.
    //The button needs to be created and then deleted
    //so that there are not several event listeners on it
    let saveButton = document.createElement("button");
    saveButton.classList.add("add-days-button");
    saveButton.innerText = "Add Days";

    //Inserting the save button into the page
    let addDaysForm = modal.querySelector(".add-days-form");
    addDaysForm.insertAdjacentElement("beforeend", saveButton);

    //Adding a class that will toggle the days modal to show up
    modal.classList.add("show");
    modalInput.focus(); //Puts the users cursor in the input field automatically.

    saveButton.addEventListener("click", (e) => {
      let amountOfDaysToAdd = modal.querySelector("#add-days-input").value;
      modal.classList.remove("show");
      //The "newPuc.insertNewPuc" will handle the tasks of finding out where to insert new pucs
      //and how to label them.
      newPuc.insertNewPuc(calendar, amountOfDaysToAdd);
      this.addInteractionsToDayCards(); //Re-adds interactions to the cards.
      modalInput.value = "";
      e.target.remove(); //Removes the save buttons so that event listeners are deleted as well.
    });
  }

  createEditButton(dayCard, originalPuc) {
    let markup = `<svg class="edit-icon" version="1.1" id="edit-icon" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 55.25 55.25"
                    style="enable-background:new 0 0 55.25 55.25;" xml:space="preserve">
                    <path
                        d="M52.618,2.631c-3.51-3.508-9.219-3.508-12.729,0L3.827,38.693C3.81,38.71,3.8,38.731,3.785,38.749
                	c-0.021,0.024-0.039,0.05-0.058,0.076c-0.053,0.074-0.094,0.153-0.125,0.239c-0.009,0.026-0.022,0.049-0.029,0.075
                	c-0.003,0.01-0.009,0.02-0.012,0.03l-3.535,14.85c-0.016,0.067-0.02,0.135-0.022,0.202C0.004,54.234,0,54.246,0,54.259
                	c0.001,0.114,0.026,0.225,0.065,0.332c0.009,0.025,0.019,0.047,0.03,0.071c0.049,0.107,0.11,0.21,0.196,0.296
                	c0.095,0.095,0.207,0.168,0.328,0.218c0.121,0.05,0.25,0.075,0.379,0.075c0.077,0,0.155-0.009,0.231-0.027l14.85-3.535
                	c0.027-0.006,0.051-0.021,0.077-0.03c0.034-0.011,0.066-0.024,0.099-0.039c0.072-0.033,0.139-0.074,0.201-0.123
                	c0.024-0.019,0.049-0.033,0.072-0.054c0.008-0.008,0.018-0.012,0.026-0.02l36.063-36.063C56.127,11.85,56.127,6.14,52.618,2.631z
                	 M51.204,4.045c2.488,2.489,2.7,6.397,0.65,9.137l-9.787-9.787C44.808,1.345,48.716,1.557,51.204,4.045z M46.254,18.895l-9.9-9.9
                	l1.414-1.414l9.9,9.9L46.254,18.895z M4.961,50.288c-0.391-0.391-1.023-0.391-1.414,0L2.79,51.045l2.554-10.728l4.422-0.491
                	l-0.569,5.122c-0.004,0.038,0.01,0.073,0.01,0.11c0,0.038-0.014,0.072-0.01,0.11c0.004,0.033,0.021,0.06,0.028,0.092
                	c0.012,0.058,0.029,0.111,0.05,0.165c0.026,0.065,0.057,0.124,0.095,0.181c0.031,0.046,0.062,0.087,0.1,0.127
                	c0.048,0.051,0.1,0.094,0.157,0.134c0.045,0.031,0.088,0.06,0.138,0.084C9.831,45.982,9.9,46,9.972,46.017
                	c0.038,0.009,0.069,0.03,0.108,0.035c0.036,0.004,0.072,0.006,0.109,0.006c0,0,0.001,0,0.001,0c0,0,0.001,0,0.001,0h0.001
                	c0,0,0.001,0,0.001,0c0.036,0,0.073-0.002,0.109-0.006l5.122-0.569l-0.491,4.422L4.204,52.459l0.757-0.757
                	C5.351,51.312,5.351,50.679,4.961,50.288z M17.511,44.809L39.889,22.43c0.391-0.391,0.391-1.023,0-1.414s-1.023-0.391-1.414,0
                	L16.097,43.395l-4.773,0.53l0.53-4.773l22.38-22.378c0.391-0.391,0.391-1.023,0-1.414s-1.023-0.391-1.414,0L10.44,37.738
                	l-3.183,0.354L34.94,10.409l9.9,9.9L17.157,47.992L17.511,44.809z M49.082,16.067l-9.9-9.9l1.415-1.415l9.9,9.9L49.082,16.067z" />
                </svg>`;
    dayCard.insertAdjacentHTML("afterbegin", markup);
    dayCard.querySelector(".edit-icon").addEventListener("click", (e) => {
      let calendarEdit = new EditCalendarDay();
      calendarEdit.introduceEditMenu(
        e.target.closest(".calendar_day"),
        originalPuc
      ); //once the pencil is clicked, it will bring up the "edit Card menu";
    });
  }
}
export { CalendarPageFrontEnd };
