let tab = "today";

const defaultSettings = {
  perRoom: 450,
  transport: 650,
  visaLimit: 4250000
};

function getSettings() {
  return JSON.parse(localStorage.getItem("settings")) || defaultSettings;
}

function saveSettings() {
  const s = {
    perRoom: Number(document.getElementById("perRoom").value),
    transport: Number(document.getElementById("transport").value),
    visaLimit: Number(document.getElementById("visaLimit").value)
  };
  localStorage.setItem("settings", JSON.stringify(s));
  alert("Settings saved");
}

function getRecords() {
  return JSON.parse(localStorage.getItem("records")) || {};
}

function saveRecord() {
  const date = document.getElementById("workDate").value;
  const rooms = Number(document.getElementById("rooms").value);
  if (!date) return alert("Select date");

  const records = getRecords();
  records[date] = rooms;
  localStorage.setItem("records", JSON.stringify(records));
  render();
}

function setTab(t) {
  tab = t;
  render();
}

function render() {
  const records = getRecords();
  const settings = getSettings();
  const content = document.getElementById("content");
  const today = new Date().toISOString().slice(0, 10);

  if (tab === "settings") {
    content.innerHTML = `
      <label>Per Room (円)</label>
      <input id="perRoom" value="${settings.perRoom}">
      <label>Transport / Day (円)</label>
      <input id="transport" value="${settings.transport}">
      <label>Visa Limit / Year (円)</label>
      <input id="visaLimit" value="${settings.visaLimit}">
      <button onclick="saveSettings()">Save Settings</button>
    `;
    return;
  }

  let totalRooms = 0;
  let totalIncome = 0;
  let totalTransport = 0;

  Object.keys(records).forEach(d => {
    if (
      (tab === "today" && d === today) ||
      (tab === "month" && d.slice(0,7) === today.slice(0,7)) ||
      (tab === "year" && d.slice(0,4) === today.slice(0,4))
    ) {
      totalRooms += records[d];
      totalIncome += records[d] * settings.perRoom;
      totalTransport += settings.transport;
    }
  });

  const net = totalIncome + totalTransport;
  const visaPercent = Math.min(
    100,
    Math.round((net / settings.visaLimit) * 100)
  );

  content.innerHTML = `
    <p>Total Rooms: <b>${totalRooms}</b></p>
    <p>Room Income: <b>¥${totalIncome}</b></p>
    <p>Transport: <b>¥${totalTransport}</b></p>
    <p>Net Income: <b>¥${net}</b></p>
    <p>Visa Usage: ${visaPercent}%</p>
  `;
}

render();
