const searchBtn = document.querySelector('#search-btn');
searchBtn.addEventListener('click', async () => {
  const departure = document.querySelector('#departure').value.trim();
  const arrival = document.querySelector('#arrival').value.trim();
  const date = document.querySelector('#date').value;
  const resultsContainer = document.querySelector('#results-container');
  // CHAMPS VIDES
  if (!departure || !arrival || !date) {
    resultsContainer.innerHTML = `
      <img src="./images/notfound.png" alt="not found">
      <div class="line"></div>
      <p>No trip found.</p>
    `;
    alert("Please complete all search fields. The database can’t read minds yet")
    return;
  }
  try {
    const response = await fetch(
      `http://localhost:3000/trips?depart=${departure}&arrivee=${arrival}&jour=${date}`
    );
    const data = await response.json();
    console.log(data);
    // AUCUN RESULTAT
    if (!data.result || data.trips.length === 0) {
      resultsContainer.innerHTML = `
        <img src="./images/notfound.png" alt="not found">
        <div class="line"></div>
        <p>No trip found.</p>
      `;
      return;
    }
    // RESET
    resultsContainer.innerHTML = '';
    // AFFICHAGE TRAJETS
    let index = 0;
    data.trips.forEach((trip) => {
      resultsContainer.innerHTML += `
                                      <div class="trip-row">
                                        <p>${trip.departure} > ${trip.arrival}</p>
                                        <p>${trip.date.$date.slice(11, 16)}</p>
                                        <p>${trip.price}€</p>
                                        <button 
                                          class="book-btn"
                                          data-depart="${trip.departure}"
                                          data-arrivee="${trip.arrival}"
                                          data-jour="${trip.date.$date}"
                                          data-prix="${trip.price}">Book
                                        </button>
                                      </div>`;
    });
    resultsContainer.scrollTo({top: 0, behavior: "smooth"});
    addEventBook();
  } catch (error) {
    console.error(error);
    resultsContainer.innerHTML = `
      <img src="./images/notfound.png" alt="not found">
      <div class="line"></div>
      <p>No trip found.</p>`;
  }
});
function addEventBook() {
  const addBooks = document.querySelectorAll('.book-btn');

  for (let i = 0; i < addBooks.length; i++) {
    addBooks[i].addEventListener('click', async function () {
      const depart = this.dataset.depart;
      const arrivee = this.dataset.arrivee;
      const jour = this.dataset.jour;
      const prix = this.dataset.prix;
      console.log({
        depart,
        arrivee,
        jour,
        prix,
      });

      try {
        const response = await fetch('http://localhost:3000/trips/selectrip', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            depart,
            arrivee,
            jour,
            prix,
          }),
        });

        const data = await response.json();

        console.log(data);
      } catch (error) {
        console.error(error);
      }
    });
  }
}
