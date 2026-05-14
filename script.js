const searchBtn = document.querySelector('#search-btn');

console.log('JS CONNECTE');

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
    data.trips.forEach(trip => {

      resultsContainer.innerHTML += `

        <div class="trip-row">

          <p>
            ${trip.departure} > ${trip.arrival}
          </p>

          <p>
            ${trip.date.$date.slice(11,16)}
          </p>

          <p>
            ${trip.price}€
          </p>

          <button class="book-btn">
            Book
          </button>

        </div>

      `;
    });

  } catch (error) {

    console.error(error);

    resultsContainer.innerHTML = `

      <img src="./images/notfound.png" alt="not found">

      <div class="line"></div>

      <p>No trip found.</p>

    `;
  }

});