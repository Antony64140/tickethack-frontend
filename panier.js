// const TripsTest = [{"_id": "1","departure":"Paris","arrival":"Marseille","date":{"$date":"2026-05-11T18:42:12.879Z"},"price":72}
//   ,{"_id": "2","departure":"Paris","arrival":"Lyon","date":{"$date":"2026-05-11T18:46:09.648Z"},"price":72}];

let totalSel=0;

function displayTrips(trips) {
  const container = document.getElementById("tripscart-container");
  const card = document.querySelector(".connexionCard > div");
  container.innerHTML = ""; // reset
  const oldFooter = document.querySelector(".cart-footer");
  if (oldFooter) oldFooter.remove();
  trips.forEach(trip => {
    const div = document.createElement("div");
    const heure = new Date(trip.date).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
    });
    console.log(heure);
    
    div.classList.add("trip-row");
    div.innerHTML = `
      <p>${trip.departure} > ${trip.arrival}</p>
      <p>${heure}</p>
      <p class="pricetrip">${trip.price}€</p>
      <span class="deleteTrip" id="${trip._id}">✖</span> 
    `;
    container.appendChild(div);
    });  
    totalSel = compteur();
    if (totalSel>0) {
        const footer = document.createElement("div");
        footer.classList.add("cart-footer");
        footer.innerHTML = `
            <p id="totaltrip">Total: ${totalSel}€</p>
            <button id="purchase-btn">Purchase</button>
        `;
        card.appendChild(footer);
        addPurchase();
      }
    }  


function compteur() {
  let total = 0;  
  
  for (let i=0; i<document.querySelectorAll('.pricetrip').length; i++) {
      total+=parseInt(document.querySelectorAll('.pricetrip')[i].textContent) || 0;      
  };
  console.log(total);
  return total;  
}

function affichageCart() {    
    document.querySelector(".CardVide").style.display = totalSel === 0 ? "block" : "none";
    document.querySelector(".connexionCard").style.display = totalSel === 0 ? "none" : "block";
    console.log(document.querySelector(".CardVide").style.display);
    console.log(document.querySelector(".connexionCard").style.display);
}

function addRemove () {
  for (let i=0; i<document.querySelectorAll('.deleteTrip').length; i++) {
    document.querySelectorAll('.deleteTrip')[i].addEventListener('click', function () {
        fetch(`http://localhost:3000/trips/suppr/${this.id}`, { method: 'DELETE' })
				.then(response => response.json())
				.then(data => {
					if (data.result) {
						this.parentNode.remove();
            totalSel = compteur();
            document.getElementById("totaltrip").textContent=`Total: ${totalSel}€`;
            affichageCart();
					}
				})
        .catch(err => console.error(err));    
    });
  }
};

function addPurchase () {
  
  document.getElementById('purchase-btn').addEventListener('click', function () {
    let tripBuy = [];  
    
    for (let i=0; i<document.querySelectorAll('.deleteTrip').length; i++) {
      console.log(document.querySelectorAll('.deleteTrip')[i].id);
      
      tripBuy.push(document.querySelectorAll('.deleteTrip')[i].id);      
    };
    console.log(tripBuy);
    
    if (tripBuy.length>0) {
      fetch(`http://localhost:3000/trips/buy`, { 
        method: 'PUT',
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({_id:tripBuy}) })

				.then(response => response.json())
				.then(data => {
					if (data.result) {
            window.location.href = 'book.html';
          }  
        })
        .catch(err => console.error(err));       
    };
  })
};

window.onload = () => {
    const linkCart = document.getElementById("linkCart");
    linkCart.style.pointerEvents = "none";
    linkCart.style.color = "#999";
    fetch("http://localhost:3000/trips/panier")
       .then(res => res.json())
       .then(data => {                                          
                     if (data.result) {
                         displayTrips(data.trips);
                         addRemove();
                     } else {
                          console.log("Erreur MONGODB");
                     };
                     affichageCart();
        })
        .catch(
          err => console.error(err)       
        );
        
    //displayTrips(TripsTest);
    //addRemove();        
};