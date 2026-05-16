function displayTrips(trips) {
    const container = document.getElementById("tripsbook-container");
    const card = document.querySelector(".connexionBook > div");
    container.innerHTML = ""; // reset
    trips.forEach(trip => {
      const div = document.createElement("div");
      const heure = new Date(trip.date).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
      });
      const departureString =  dateDiffToday(trip.date); 
      div.classList.add("trip-row");
      div.innerHTML = `
        <p>${trip.departure} > ${trip.arrival}</p>
        <p>${heure}</p>
        <p class="pricetrip">${trip.price}€</p>
        <p>${departureString}</p>` 
      container.appendChild(div);
    });  
}
function dateDiffToday (dateTrip) {
  const diffMs = new Date(dateTrip) - Date.now() ;
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  let dateDiffString="";

  if (days>0) {
    dateDiffString+= (days===1) ? "one day " : days+" days ";
  }
  if (hours>0) {
    dateDiffString+= (hours===1) ? " one hour" : hours+" hours";
  }
    
  if (days === 0 && hours === 0 && diffMs>0 ){
    return  "Run! The train’s leaving without you!"
  } else{
    return diffMs<0 ? "Too late, you missed it" : "Departure in " + dateDiffString ;
  }
}

function affichageBook(tripsLength) {
  console.log(tripsLength);  
  document.querySelector(".BookVide").style.display = tripsLength === 0 ? "block" : "none";
  document.querySelector(".connexionBook").style.display = tripsLength > 0 ? "block" : "none";
}


window.onload = () => {
    const linkBook = document.getElementById("linkBook");
    linkBook.style.pointerEvents = "none";
    linkBook.style.color = "#999";
    affichageBook(0);
    fetch("http://localhost:3000/trips/book")
       .then(res => res.json())
       .then(data => {if (data.result) {
                         displayTrips(data.trips);
                     } else {
                          console.log("Erreur MONGODB");
                     };
                     console.log(data.trips.length);
                     
                     affichageBook(data.trips.length);
        })
        .catch(
          err => console.error(err)       
        );
  
};