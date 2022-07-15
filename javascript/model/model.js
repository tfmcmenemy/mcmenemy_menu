class DatabaseConnections {
  save(button) {
    //Get the data from the card that the save button was clicked on
    let parentCard = button.closest(".menu-card");
    let mealID = parentCard.dataset.mealId;
    let newCard = false;
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
    let rawSides = [];
    Array.from(
      parentCard
        .querySelector(`#card-sides-${parentCard.dataset.card}`)
        .querySelectorAll("input")
    ).forEach((side) => {
      if (side.value.length > 0) rawSides.push(side.value);
    });
    let sides = "";

    if (rawSides.length == 0) {
      sides = "{}";
    } else {
      sides = this.convertArrayToPostgresArray(rawSides);
    }
    parentCard.classList.contains("new-card")
      ? (newCard = true)
      : (newCard = false);
    //Send that data to the server in order to save it to the database
    //maybe make an await function to show the user what is happening
    fetch(
      `/save?mealID=${mealID}&entree=${entree}&tomHome=${tomHome}&timehome=${timeHome}&date=${
        date || "1900-01-01"
      }&conflicts=${conflicts}&notes=${notes}&sides=${sides}&newCard=${newCard}`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(`There was an error: ${err}`));
  }

  convertArrayToPostgresArray(arr) {
    return "{".concat(arr.join(", "), "}");
  }

  // changeMealIdInHTML(mealID, parentCard) {
  //   let originalCardID = parentCard.dataset.card;
  //   parentCard.outerHTML.replaceAll(originalCardID, mealID);
  //   // parentCard.outerHTML = newHTML;
  // }
}

export { DatabaseConnections };
