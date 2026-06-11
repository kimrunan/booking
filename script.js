const seatData = [
  { id: 1, top: 510, left: 180 },
  { id: 2, top: 460, left: 240 },
  { id: 3, top: 510, left: 300 },
  { id: 4, top: 550, left: 360 },
  { id: 5, top: 600, left: 400 },
  { id: 6, top: 460, left: 480 },
  { id: 7, top: 650, left: 200 },
  { id: 8, top: 540, left: 270 },
  { id: 9, top: 300, left: 580 },
  { id: 10, top: 250, left: 640 },
  { id: 11, top: 200, left: 700 },
  { id: 12, top: 160, left: 760 }
];

const booked = []; // Her vil du hente fra Google Sheet

const container = document.getElementById("seats");
const list = document.getElementById("bookedItems");
const lock = LockService.getScriptLock();

lock.waitLock(30000);

try {

   // sjekk om plass er ledig
   // legg inn booking

} finally {

   lock.releaseLock();

}
seatData.forEach(seat => {
  const btn = document.createElement("div");
  btn.classList.add("seat");
  btn.textContent = seat.id;
  btn.style.top = seat.top * 0.7 + "px";     // justert for responsiv visning
  btn.style.left = seat.left * 0.7 + "px";
  if (booked.includes(seat.id)) {
    btn.classList.add("opptatt");
    list.innerHTML += `<li>Plass ${seat.id} - [Navn]</li>`; // erstatt med faktisk navn
  } else {
    btn.addEventListener("click", () => openPopup(seat.id));
  }
  container.appendChild(btn);
});

function openPopup(seatId) {
  document.getElementById("popup").classList.remove("hidden");
  document.getElementById("selectedSeat").innerText = seatId;
  document.getElementById("seatNumber").value = seatId;
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

function showBooking(data) {

    document.getElementById("bookingIcon").textContent = data.icon;
    document.getElementById("bookingTitle").textContent = data.name;

    const status = document.getElementById("bookingStatus");
    const details = document.getElementById("bookingDetails");

    if(data.booked){

        status.textContent = "Opptatt";
        status.className = "booking-status opptatt";

        details.classList.remove("hidden");

        document.getElementById("bookingName").textContent = data.customer;
        document.getElementById("bookingFrom").textContent = data.from;
        document.getElementById("bookingTo").textContent = data.to;

    } else {

        status.textContent = "Ledig";
        status.className = "booking-status ledig";

        details.classList.add("hidden");
    }
}

// Fyll inn din Web App URL fra Apps Script her:
document.getElementById("bookingForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const seat = document.getElementById("seatNumber").value;
  const name = document.getElementById("name").value;
  const timestamp = new Date().toISOString();

  fetch("DIN_WEB_APP_URL", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ seat, name, timestamp })
  }).then(() => {
    alert("Booking registrert!");
    location.reload();
  });
});
