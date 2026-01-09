const ROOM_RATE = 450;
const TRANSPORT = 650;

const todayDiv = document.getElementById("today");
const roomsInput = document.getElementById("rooms");
const incomeSpan = document.getElementById("income");
const saveBtn = document.getElementById("saveBtn");

const today = new Date();
const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
const dateKey = today.toISOString().split("T")[0];

todayDiv.textContent = `Today: ${dayName}, ${dateKey}`;

const isWorkDay = dayName === "Monday" || dayName === "Friday";

if (!isWorkDay) {
  roomsInput.disabled = true;
  saveBtn.disabled = true;
  todayDiv.textContent += " (No work day)";
}

function calculate() {
  const rooms = Number(roomsInput.value || 0);
  const total = rooms * ROOM_RATE + (isWorkDay ? TRANSPORT : 0);
  incomeSpan.textContent = total.toLocaleString() + " 円";
}

roomsInput.addEventListener("input", calculate);

saveBtn.addEventListener("click", () => {
  const rooms = Number(roomsInput.value || 0);
  const data = JSON.parse(localStorage.getItem("records") || "{}");
  data[dateKey] = { rooms };
  localStorage.setItem("records", JSON.stringify(data));
  alert("Saved!");
});
