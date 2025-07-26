const formBaseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeUwKg5fH5LebqauOoRgm88KjTGLKXe1XjOkApEbwXYYvEkRw/viewform?usp=pp_url&entry.1234567890=";
const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSWeVLX-_EP_glVBrHjj4FtpaSe0jhZyv06OQPruEiso18V_pIEON82yHUX2S1WE1RckemMIOFx9a-a/pub?output=csv";

const seatPositions = [
  [100, 100], [160, 100], [220, 100], [280, 100], [340, 100], [400, 100], [460, 100],
  [100, 180], [160, 180], [220, 180], [280, 180], [340, 180], [400, 180], [460, 180]
];

function createSeat(num, isTaken) {
  const seat = document.createElement(isTaken ? "div" : "a");
  seat.textContent = num;
  seat.className = `seat ${isTaken ? "opptatt" : "ledig"}`;
  seat.style.top = seatPositions[num - 1][1] + "px";
  seat.style.left = seatPositions[num - 1][0] + "px";
  seat.style.position = "absolute";

  if (!isTaken) {
    seat.href = formBaseUrl + encodeURIComponent("Plass " + num);
    seat.target = "_blank";
  }

  return seat;
}

fetch(sheetUrl)
  .then(res => res.text())
  .then(csv => {
    const lines = csv.trim().split("\n");
    const takenSeats = new Map();

    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split(",");
      const timestamp = columns[0]?.trim();
      const plassRaw = columns[1]?.trim();
      const navn = columns[2]?.trim();

      const match = plassRaw.match(/\d+/);
      if (match) {
        const seatNum = parseInt(match[0], 10);
        if (!isNaN(seatNum)) {
          takenSeats.set(seatNum, {
            navn: navn || "Ukjent",
            tidspunkt: timestamp || ""
          });
        }
      }
    }

    const container = document.getElementById("seats");
    const list = document.getElementById("bookedItems");

    for (let i = 1; i <= 14; i++) {
      const booking = takenSeats.get(i);
      const isTaken = takenSeats.has(i);
      container.appendChild(createSeat(i, isTaken));

      if (isTaken) {
        const li = document.createElement("li");
        li.textContent = `Plass ${i} – ${booking.navn} – ${booking.tidspunkt}`;
        list.appendChild(li);
      }
    }
  });
