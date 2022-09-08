class NewCalendarPuc {
  constructor() {}

  insertNewPuc(calendar, amountOfDaysToAdd) {
    //This will loop over the amount of days that are requested to be added.
    //1) calculates the previous date
    //2) generates the markup needed to be inserted
    //3) inserts that since puc into the calendar
    //4) continues to loop over the rest of the requested days
    for (let i = 0; i < amountOfDaysToAdd; i++) {
      let previousDate = this.getLastDateFromPreviousPuc(calendar);
      let markup = this.getMarkup(previousDate);
      calendar.insertAdjacentHTML("beforeend", markup);
    }
  }

  getMarkup(date) {
    //Takes a date input and adds one day to it and returns the markup.
    let newDate = new Date(date.setDate(date.getDate() + 1));
    let markup = `<div class="calendar_day xxx" data-typeOfDay="xxx">
                <div class="calendar_day-date" data-year="${newDate.getFullYear()}">
                    <div class="month">${this.convertMonthToThreeLetterLabel(
                      newDate.getMonth() + 1
                    )}</div>
                    <div class="date">${newDate.getDate()}</div>
                </div>
                <div class="calendar_day-day-of-the-week">${this.convertDayNumberToDay(
                  newDate.getDay()
                )}</div>
                <div class="calendar_day-duty-type">
                    <div class="label">Duty Type</div>
                    <div class="duty">---</div>
                </div>
                <div class="calendar_day-airport">
                    <div class="label">Assigned Airport</div>
                    <div class="airport">---</div>
                </div>
                <div class="calendar_day-times-label-duty">Duty Times</div>
                <div class="calendar_day-start-time">--</div>
                <div class="calendar_day-start-time-arrow">&#x2192;</div>

                <div class="calendar_day-end-time">--</div>
                <div class="calendar_day-times-label-home">Home Times</div>

                <div class="calendar_day-leave-home-time">--</div>
                <div class="calendar_day-leave-home-arrow">&#x2192;</div>
                <div class="calendar_day-get-home-time">--</div>
                <div class="calendar_day-airports">---</div>

                <div class="edit-menu">
                    <div class="blank-day">
                        <div class="button-choices">
                            <div class="duty-btn rdo">RDO</div>
                            <div class="duty-btn alv">ALV</div>
                            <div class="duty-btn skl">SKL</div>
                            <div class="duty-btn adm">ADM</div>
                            <div class="duty-btn nms">NMS</div>
                            <div class="duty-btn trn">TRN</div>
                            <div class="duty-btn trn">ACY</div>
                            <div class="duty-btn inl">INL</div>
                            <div class="duty-btn dom">DOM</div>
                            <div class="duty-btn sm1">SM</div>
                            <div class="duty-btn rec">REC</div>
                                                        <div class="duty-btn ops">OPS</div>

                        </div>
                    </div>
                </div>
            </div>`;
    return markup;
  }

  convertMonthToThreeLetterLabel(month) {
    switch (month) {
      case 1:
        return "JAN";
      case 2:
        return "FEB";
      case 3:
        return "MAR";
      case 4:
        return "APR";
      case 5:
        return "MAY";
      case 6:
        return "JUN";
      case 7:
        return "JUL";
      case 8:
        return "AUG";
      case 9:
        return "SEP";
      case 10:
        return "OCT";
      case 11:
        return "NOV";
      case 12:
        return "DEC";
    }
  }

  convertThreeLetterLabelToMonth(month) {
    switch (month) {
      case "JAN":
        return 1;
      case "FEB":
        return 2;
      case "MAR":
        return 3;
      case "APR":
        return 4;
      case "MAY":
        return 5;
      case "JUN":
        return 6;
      case "JUL":
        return 7;
      case "AUG":
        return 8;
      case "SEP":
        return 9;
      case "OCT":
        return 10;
      case "NOV":
        return 11;
      case "DEC":
        return 12;
    }
  }

  convertDayNumberToDay(day) {
    switch (day) {
      case 0:
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
    }
  }

  getLastDateFromPreviousPuc(calendar) {
    //Finds the last child in the "calendar" and then calculates
    //the year, month and day, and returns that as a date.
    let lastPuc = calendar.lastElementChild;
    let year = lastPuc.querySelector(".calendar_day-date").dataset.year;
    let month = lastPuc.querySelector(".month").innerText;
    let day = lastPuc.querySelector(".date").innerText;
    let previousDate = new Date(`${month}-${day}-${year}`);
    return previousDate;
  }
}
export { NewCalendarPuc };
