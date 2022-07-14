const addNewMenuCard = function (menuCards, menuCardContainer, hamburgerMenu) {
  //below finds what the next logical card number should be. This will only be a placeholder though.
  //The reason for this is because once the card is saved, the index in the database may be different.
  //To fix this, once the card is saved, the server will return the index of the new database record.
  //Then a function will run to correct the index number on the site incase it saves again.
  const menuCardNumbers = [];
  menuCards.map((card) => menuCardNumbers.push(card.dataset.mealId));
  let tempCardNumber;
  let newCardNumber;
  //   if (menuCardNumbers.length > 0) {
  //     let rawNumbers = menuCardNumbers.map((cardNumber) => Number(cardNumber));
  //     rawNumbers = rawNumbers.filter((rawNumber) => typeof rawNumber == "number");
  //     console.log(rawNumbers);
  //     newCardNumber = Math.max(...rawNumbers) + 1;
  //   }

  //   if (menuCardNumbers.length <= 0) {
  newCardNumber = "newlyAddedCard" + Math.floor(Math.random() * 10000);
  //   }

  const markup = `<div class="menu-card new-card" data-card="${newCardNumber}" data-new="no" id="testCard" data-meal-ID="${newCardNumber}">
                    <form action="#">
                        <div class="save-button">
                            Save
                        </div>
                        <div class="input-group">
                            <input data-original-entry="" type="date" id="card-date-${newCardNumber}" class="card-input" placeholder=" "
                                autocomplete="off" data-type="date">
                            <label for="card-date-${newCardNumber}" class="card-label">Date
                            </label>
                        </div>
    
                        <div class="form-group">
                            <span class="tom-home">Will Tom be home?</span>
                            <div class="input-group slider">
                                <input data-original-entry="" type="checkbox" id="card-tom-home-checkbox-${newCardNumber}"
                                    class="card-input" placeholder=" " autocomplete="off" data-type="homeOrNo">
                                <label for="card-tom-home-checkbox-${newCardNumber}" class="">
                                </label>
                            </div>
    
                            <div class="input-group">
                                <input data-original-entry="" type="text" id="card-time-home-${newCardNumber}" class="card-input"
                                    placeholder=" " autocomplete="off" data-type="timeOff">
                                <label for="card-time-home-${newCardNumber}" class="card-label">Time
                                </label>
                            </div>
    
                        </div>
    
    
                        <div class="input-group whole-width">
                            <input data-original-entry="" type="text" id="card-other-activities-${newCardNumber}" class="card-input"
                                placeholder=" " autocomplete="off" data-type="other-activities">
                            <label for="card-other-activities-${newCardNumber}" class="card-label">Conflicts (gymnastics,
                                volleyball)...
                            </label>
                        </div>
    
                        <div class="input-group whole-width">
                            <input data-original-entry="" value="" type="text" id="card-meal-${newCardNumber}"
                                class="card-input" placeholder=" " autocomplete="off" data-type="meal">
                            <label for="card-meal-${newCardNumber}" class="card-label">Entree
                            </label>
                        </div>
    
                        <div id="card-sides-${newCardNumber}" class="card-sides">
    
                            <div class="input-group whole-width close-top-margin">
                                <input data-original-entry="" type="text" id="card-side-${newCardNumber}-1" class="card-input indent-left"
                                    placeholder=" " autocomplete="off" data-type="side">
                                <label for="card-side-${newCardNumber}-1" class="card-label indent-left">Side
                                </label>
                                <div class="circle-button" id="add-side-${newCardNumber}"><svg fill="red"
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
                                    </svg></div>
                            </div>
    
                        </div>
    
    
    
                        <div class="input-group notes">
                            <textarea data-original-entry="" name="card-notes-${newCardNumber}" id="card-notes-${newCardNumber}" cols="40" rows="3"
                                id="card-notes-${newCardNumber}" class="card-input textarea-notes" placeholder="Notes"
                                data-type="notes"></textarea>
                        </div>
                    </form>
                </div>`;

  menuCardContainer.insertAdjacentHTML("beforeend", markup);
  hamburgerMenu.click();
};

export { addNewMenuCard };
