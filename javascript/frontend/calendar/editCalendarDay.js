class EditCalendarDay {
  constructor() {}

  introduceEditMenu(originalCard, originalPuc) {
    //This will bring in the edit menu from the right side of the screen. The menu was created when a new puc was added.
    let editMenu = originalCard.querySelector(".edit-menu");

    //Checks to see if this is a blank day, if it is not, then it will just stop execution.
    if (originalCard.dataset.typeofday != "xxx") {
      alert("Another menu needs to come up here."); //PLACEHOLDER
      return;
    }

    editMenu.classList.add("activated"); //This will trigger the animation to bring it in.

    this.addEditMenuButtonEvents(editMenu, originalPuc);
  }

  addEditMenuButtonEvents(editMenu, originalPuc) {
    //Adds a specific action to each time that aa button from the edit menu is clicked.
    let buttons = Array.from(editMenu.querySelectorAll(".duty-btn"));
    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        let typeOfDay = e.target.innerText;
        switch (typeOfDay) {
          case "RDO":
          case "ALV":
          case "SKL":
          case "ADM":
            this.leaveDayMenu(typeOfDay, originalPuc);
            break;
          case "NMS":
            this.fixedTimeMenu(typeOfDay, originalPuc);
            break;
          case "TRN":
          case "ACY":
            this.trainingMenu(typeOfDay, originalPuc, e.target);
            break;
          case "INL":
          case "DOM":
            this.variableTimeMenu(typeOfDay, originalPuc);
            break;
          case "SM":
          case "REC":
          case "OPS":
            this.recoveryAndOpsMenu(typeOfDay, originalPuc, e.target);
            break;
          default:
            console.log("Code not found.");
        }
      });
    });
  }

  leaveDayMenu(dayType, originalPuc) {
    //Any day that is a leave day does not have a fixed start and end time, so
    //it can very easily just be changed without the need of more user input.

    let newPucValues = {
      type: dayType,
      duty: dayType,
      airport: "",
      startTime: "",
      endTime: "",
      leaveHomeTime: "",
      getHomeTime: "",
      airports: "",
    };

    this.changePucValues(originalPuc, newPucValues);
    this.saveChangesToServer(originalPuc);
    this.closeExpandedView();
  }
  fixedTimeMenu(dayType, originalPuc) {
    let newPucValues = {
      type: dayType,
      duty: dayType,
      airport: "",
      startTime: "0700",
      endTime: "1530",
      leaveHomeTime: "",
      getHomeTime: "",
      airports: "",
    };

    this.changePucValues(originalPuc, newPucValues);
    this.saveChangesToServer(originalPuc);
    this.closeExpandedView();
  }
  trainingMenu(typeOfDay, originalPuc, buttonClicked) {
    this.animateTwelveButtons(buttonClicked);

    let editFrame = buttonClicked.closest(".blank-day");
    if (typeOfDay.toLowerCase() == "trn") {
      //Creates the range button
      let rangeButton = document.createElement("div");
      rangeButton.classList.add("trainingButtons");
      rangeButton.classList.add("range");
      rangeButton.innerText = "Range";

      //Creates the WFO button
      let wfoButton = document.createElement("div");
      wfoButton.classList.add("trainingButtons");
      wfoButton.classList.add("wfo");
      wfoButton.innerText = "WFO";

      //inserts the buttons on the document
      editFrame.insertAdjacentElement("afterbegin", rangeButton);
      editFrame.insertAdjacentElement("afterbegin", wfoButton);

      //Sets the correct position property to each buttons
      setTimeout(() => {
        rangeButton.classList.add("move");
        wfoButton.classList.add("move");
      }, 0);

      rangeButton.addEventListener("click", (e) => {
        let newPucValues = {
          type: typeOfDay,
          duty: typeOfDay,
          airport: "Range",
          startTime: "0700",
          endTime: "1530",
          leaveHomeTime: "0620",
          getHomeTime: "1540",
          airports: "",
        };
        this.changePucValues(originalPuc, newPucValues);
        this.saveChangesToServer(originalPuc);
        this.closeExpandedView();
      });
      wfoButton.addEventListener("click", (e) => {
        let newPucValues = {
          type: typeOfDay,
          duty: typeOfDay,
          airport: "WFO",
          startTime: "0700",
          endTime: "1530",
          leaveHomeTime: "0545",
          getHomeTime: "1615",
          airports: "",
        };
        this.changePucValues(originalPuc, newPucValues);
        this.saveChangesToServer(originalPuc);
        this.closeExpandedView();
      });
    }

    if (typeOfDay.toLowerCase() == "acy") {
      let newPucValues = {
        type: typeOfDay,
        duty: typeOfDay,
        airport: "ACY",
        startTime: "--",
        endTime: "--",
        leaveHomeTime: "--",
        getHomeTime: "--",
        airports: "",
      };
      this.changePucValues(originalPuc, newPucValues);
      this.saveChangesToServer(originalPuc);
      this.closeExpandedView();
    }
  }
  recoveryAndOpsMenu(typeOfDay, originalPuc, buttonClicked) {
    let editFrame = buttonClicked.closest(".blank-day");

    //Animates the current buttons off page.
    this.animateTwelveButtons(buttonClicked);

    if (typeOfDay == "SM") {
      //Handle all of the SM options
      for (let i = 1; i < 4; i++) {
        //Creates the SM buttons
        window[`sm${i}Button`] = document.createElement("div");

        //Styles the SM buttons, and adds the visible text
        window[`sm${i}Button`].classList.add("recoveryButtons");
        window[`sm${i}Button`].classList.add("smButtons");
        window[`sm${i}Button`].classList.add(`sm${i}`);

        window[`sm${i}Button`].innerText = i;

        //Inserts the SM buttons into the page.
        editFrame.insertAdjacentElement("afterbegin", window[`sm${i}Button`]);

        setTimeout(() => {
          window[`sm${i}Button`].classList.add("move");
        }, 0);

        window[`sm${i}Button`].addEventListener("click", (e) => {
          let newPucValues = {
            type: typeOfDay,
            duty: typeOfDay + i,
            airport: "IAD",
            startTime: i == 1 ? "0600" : i == 2 ? "1000" : "1800",
            endTime: i == 1 ? "1400" : i == 2 ? "1800" : "2200",
            leaveHomeTime: i == 1 ? "0530" : i == 2 ? "0915" : "1730",
            getHomeTime: i == 1 ? "1445" : i == 2 ? "1900" : "2230",
            airports: "",
          };
          this.changePucValues(originalPuc, newPucValues);
          this.saveChangesToServer(originalPuc);
          this.closeExpandedView();
        });
      }
    }

    if (typeOfDay == "REC") {
      //Generates the markup and inserts it
      let recoveryMarkup = this.getRecoveryMenuMarkup();
      let editFrame = buttonClicked.closest(".blank-day");
      editFrame.insertAdjacentHTML("afterbegin", recoveryMarkup);

      //Declares variables that will be needed in the later steps.
      let iadButton = editFrame.querySelector(".iad");
      let dcaButton = editFrame.querySelector(".dca");
      let timeCollection = editFrame.querySelector(".timeCollection");
      let buttonGroup = editFrame.querySelector(".buttonGroup");
      let buttons = [iadButton, dcaButton];
      let saveButton = editFrame.querySelector(".recoverySaveButton");

      saveButton.addEventListener("click", (e) => {
        let airport = "";
        buttons.forEach((btn) => {
          if (btn.classList.contains("selected")) {
            airport = btn.innerText;
          }
        });
        console.log(airport);
      });

      buttonGroup.addEventListener("click", (e) => {
        buttons.forEach((btn) => {
          if (btn.classList.contains("selected"))
            btn.classList.remove("selected");
        });

        e.target.classList.add("selected");
      });

      //If there are 4 or more digits in the input field, no more entries are allowed.
      Array.from(timeCollection.querySelectorAll("input")).forEach((input) => {
        input.addEventListener("keydown", (e) => {
          if (e.target.value.length >= 4) {
            if (parseInt(e.key)) e.preventDefault();
          }
        });
      });

      //Adds functionality to the save button
      saveButton.addEventListener("click", () => {
        //Check to se if an airport was selected
        //
        //Check to make sure that all of the inputs hav a valid 4 digit time
        //the last two digits are lower than 60
        //it is 4 digits long
        //it is a number
        //
        //
      });
      //Adds the animations to the bottom of the stack.
      setTimeout(() => {
        iadButton.classList.add("move");
        dcaButton.classList.add("move");
        timeCollection.classList.add("move");
      }, 0);
    }
  }

  variableTimeMenu() {}

  // collectValuesFromOriginalPUC(originalPuc) {
  //   let x = originalPuc;
  //   function f(input) {
  //     return x.querySelector(input).innerText;
  //   }

  //   let originalPucInfo = {
  //     type: x.dataset.typeofday,
  //     year: x.querySelector(".calendar_day-date").dataset.year,
  //     month: f(".month"),
  //     day: f(".date"),
  //     dayOfTheWeek: f(".calendar_day-day-of-the-week"),
  //     duty: f(".duty"),
  //     airport: f(".airport"),
  //     startTime: f(".calendar_day-start-time"),
  //     endTime: f(".calendar_day-end-time"),
  //     leaveHomeTime: f(".calendar_day-leave-home-time"),
  //     getHomeTime: f(".calendar_day-get-home-time"),
  //     airports: f(".calendar_day-airports"),
  //   };
  // }

  changePucValues(originalPuc, itemsToChange) {
    let x = originalPuc;
    function f(input) {
      return x.querySelector(input);
    }

    let pucAddresses = {
      month: f(".month"),
      day: f(".date"),
      dayOfTheWeek: f(".calendar_day-day-of-the-week"),
      duty: f(".duty"),
      airport: f(".airport"),
      startTime: f(".calendar_day-start-time"),
      endTime: f(".calendar_day-end-time"),
      leaveHomeTime: f(".calendar_day-leave-home-time"),
      getHomeTime: f(".calendar_day-get-home-time"),
      airports: f(".calendar_day-airports"),
    };

    for (const [key, value] of Object.entries(itemsToChange)) {
      if (key == "type") {
        //The type property needs to be edited differently than the other items.
        //So if the key is equal to "type" then this will change what it needs to
        //and then it will 'conuine' out of the loop.
        let currentTypeOfDay = originalPuc.dataset.typeofday;
        originalPuc.classList.remove(currentTypeOfDay);

        //Changes the day class and properties in the markup
        originalPuc.dataset.typeofday = itemsToChange.duty.toLowerCase();
        originalPuc.classList.add(itemsToChange.duty.toLowerCase());

        //Enters the correct duty to the users display
        originalPuc.dataset.typeofday = itemsToChange.duty.toUpperCase();

        continue; //Skips to the nex iteration
      }

      pucAddresses[key].innerText = itemsToChange[key];
    }
  }

  animateTwelveButtons(buttonClicked) {
    {
      //Animate the buttons leaving the screen in order to show the next series of buttons.
      //
      //Gets the first six buttons from the edit menu
      let topSixButtons = Array.from(
        buttonClicked.closest(".button-choices").querySelectorAll(".duty-btn")
      );

      //clones the array in order to then split the array.
      let bottomSixButtons = [...topSixButtons];

      //Takes the first 6 values as the first six buttons
      topSixButtons.length = 6;

      //Takes the bottom six values as the last six buttons.
      bottomSixButtons = bottomSixButtons.slice(-6);

      //gives the top position to the first six buttons.
      topSixButtons.forEach((btn) => {
        btn.style.top = "-250%";
      });
      //gives the bottom position to the last six buttons.
      bottomSixButtons.forEach((btn) => {
        btn.style.top = "250%";
      });
    }
  }

  closeExpandedView() {
    let expandedCardView = document.querySelector(".day-card-backdrop");
    expandedCardView.remove();

    //Add something in to delete all of the buttons that were created.
  }

  getRecoveryMenuMarkup() {
    return ` <div class="buttonGroup">
            <div class="iad recoveryButtons ">IAD</div>
            <div class="dca recoveryButtons ">DCA</div>
        </div>
        <div class="timeCollection">

            <div class="formInputGroup">
                <input id="startTime" class="timeInput" pattern="[0-9]*"   type="number" placeholder=" ">
                <label for="startTime" class="timeLabel">Start Time</label>
            </div>
            <div class="formInputGroup">
                <input id="endTime" class="timeInput" pattern="[0-9]*"  type="number" placeholder=" ">
                <label for="endTime" class="timeLabel">End Time</label>
            </div>
            <div class="formInputGroup">
                <input id="leaveHome" class="timeInput" pattern="[0-9]*"   type="number" placeholder=" ">
                <label for="leaveHome" class="timeLabel">Leave Home</label>
            </div>
            <div class="formInputGroup">
                <input id="getHome" class="timeInput" pattern="[0-9]*"   type="number" placeholder=" ">
                <label for="getHome" class="timeLabel">Get Home</label>
            </div>

            <div class="recoverySaveButton">Save</div>

        </div>`;
  }

  checkFourDigitTimeValidity(time) {}

  saveChangesToServer(originalPuc) {
    //NEEDS WORK
    //
    //
    //This should only be triggered by a save event. With the exception of leave days, but
    // even then there should be a message that pops up to make sure that they want to make it a leave day... except if the day is blank.
    //
    //
    //Collect all the information from the original PUC.
    //Compare what information is different.
    //Send a fetch request to the server to save that information.
  }
}

export { EditCalendarDay };
