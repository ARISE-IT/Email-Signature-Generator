const correctPasscode = "111";

function checkPasscode() {
  const input = document.getElementById("passcodeInput").value;
  const errorText = document.getElementById("error");

  if (input === correctPasscode) {
    document.getElementById("passcodePrompt").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
    updateSignature(); // update signature once unlocked
  } else {
    errorText.textContent = "Incorrect passcode. Please try again.";
  }
}

const appOptions = {
  computer: [
    { value: "Outlook 365 (Desktop) Mac", text: "Outlook for Mac" },
    { value: "Chrome Outlook 365", text: "Outlook in Browser" },
    { value: "Apple Mail Mac", text: "Apple Mail" }
  ],
  iphone: [
    { value: "Outlook 365 for iPhone", text: "Outlook for iPhone" },
    { value: "Mail for iPhone", text: "Apple Mail" }
  ],
    ipad: [ // 👈 NEW DEVICE
    { value: "Outlook 365 for iPad", text: "Outlook for iPad" },
    { value: "Apple Mail for iPad", text: "Apple Mail for iPad" }
  ]
};

const screenshotCounts = {
  "Mail for iPhone": 7,
  "Outlook 365 for iPhone": 5,
  "Outlook 365 (Desktop) Mac": 6,
  "Apple Mail Mac": 8,
  "Chrome Outlook 365": 4,
  "Outlook 365 for iPad": 6,     // 👈 NEW
  "Apple Mail for iPad": 6       // 👈 NEW
};

let currentImageIndex = 0;
let currentApp = "";

function updateAppDropdown() {
  const device = document.getElementById("device").value;
  const appSelect = document.getElementById("app");
  const appSection = document.getElementById("appSection");
  const screenshotGallery = document.getElementById("screenshotGallery");

  appSelect.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "-- Select App --";
  appSelect.appendChild(placeholder);

  screenshotGallery.innerHTML = "";
  screenshotGallery.style.display = "none";

  if (!device) {
    appSection.style.display = "none";
    return;
  }

  appOptions[device].forEach(app => {
    const option = document.createElement("option");
    option.value = app.value;
    option.textContent = app.text;
    appSelect.appendChild(option);
  });

  appSection.style.display = "block";
}

function showInstructions() {
  currentApp = document.getElementById("app").value;
  const gallery = document.getElementById("screenshotGallery");

  gallery.innerHTML = "";

  if (!currentApp || !screenshotCounts[currentApp]) {
    gallery.style.display = "none";
    return;
  }

  const count = screenshotCounts[currentApp];
  for (let i = 1; i <= count; i++) {
    const fileName = `${currentApp} ${i}.png`;
    const img = document.createElement("img");
    img.src = `Email Signature Screenshots/${currentApp}/${fileName}`;
    img.alt = `Step ${i}`;
    img.dataset.index = i;
    img.style.cursor = "pointer";
    img.addEventListener("click", () => openLightbox(i));
    gallery.appendChild(img);
  }

  gallery.style.display = "flex";
}

function openLightbox(index) {
  currentImageIndex = index;
  updateLightboxImage();
  document.getElementById("lightbox").style.display = "flex";
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

function updateLightboxImage() {
  const img = document.getElementById("lightboxImage");
  const src = `Email Signature Screenshots/${currentApp}/${currentApp} ${currentImageIndex}.png`;
  img.src = src;
  img.alt = `Step ${currentImageIndex}`;
}

function nextImage() {
  if (currentImageIndex < screenshotCounts[currentApp]) {
    currentImageIndex++;
    updateLightboxImage();
  }
}

function prevImage() {
  if (currentImageIndex > 1) {
    currentImageIndex--;
    updateLightboxImage();
  }
}


// Your original updateSignature function + helpers:

function updateSignature() {
  const name = document.getElementById('fullName').value || 'Your Name';
  const role = document.getElementById('role').value || 'Your Role';
  const campus = document.getElementById('campus').value.trim();
  const phone = document.getElementById('phone').value || 'Phone';
  const email = document.getElementById('email').value || 'email@example.com';
  const location = campus ? `${campus} Office` : '';
  const campusText = campus ? `${campus}` : '<span style="display:inline-block; height: 1em;"></span>';

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayMap = {}; // Group by time range: { '9:00 AM – 5:00 PM': ['Mon', 'Tue', 'Wed'] }

  days.forEach(day => {
    const checkbox = document.querySelector(`input[type="checkbox"][value="${day}"]`);
    const startInput = document.getElementById(`${day}Start`);
    const endInput = document.getElementById(`${day}End`);

    if (checkbox?.checked && startInput?.value && endInput?.value) {
      const start = formatTime(startInput.value);
      const end = formatTime(endInput.value);
      const timeRange = `${start} – ${end}`;

      if (!dayMap[timeRange]) {
        dayMap[timeRange] = [];
      }
      dayMap[timeRange].push(day);
    }
  });

  const dayFullNames = {
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
    Sun: 'Sunday'
  };

  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  function collapseDayRanges(dayAbbrList) {
    const fullDays = dayAbbrList.map(d => dayFullNames[d]);
    fullDays.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));

    const ranges = [];
    let start = fullDays[0];
    let end = fullDays[0];

    for (let i = 1; i < fullDays.length; i++) {
      const current = fullDays[i];
      if (dayOrder.indexOf(current) === dayOrder.indexOf(end) + 1) {
        end = current;
      } else {
        ranges.push(start === end ? start : `${start}–${end}`);
        start = end = current;
      }
    }

    ranges.push(start === end ? start : `${start}–${end}`);
    return ranges;
  }

  const scheduleLines = [];

  for (const [timeRange, groupedDays] of Object.entries(dayMap)) {
    const collapsed = collapseDayRanges(groupedDays);
    collapsed.forEach(group => {
      scheduleLines.push(`${group}: ${timeRange}`);
    });
  }

  const sundayChecked = document.getElementById('SundayServices')?.checked;
  if (sundayChecked) {
    scheduleLines.push("Sunday Services");
  }

  let workSchedule = '';
  if (scheduleLines.length > 0) {
    workSchedule = `<div>📅 <strong>Workdays:</strong></div>` +
      scheduleLines.map(line => `<div>${line}</div>`).join('');
  }

  document.getElementById('sigDetails').innerHTML = `
    <div><strong>${name}</strong></div>
    <div><em>${role}</em></div>
    <div><span style="font-size: 80%;">📞</span> ${phone}</div>
    <div><span style="font-size: 80%;">📧</span> ${email}</div>
    <div><span style="font-size: 80%;">📍</span> ${location}</div>
    ${workSchedule}<br>
  `;
}


// Helper to format 24h → 12h time
function formatTime(time) {
  if (!time) return '';
  const [hour, minute] = time.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 || 12;
  return `${h}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

// Collapse day sequences (e.g., Mon–Wed, Fri)
function collapseDays(days) {
  const order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  days.sort((a, b) => order.indexOf(a) - order.indexOf(b));

  const ranges = [];
  let start = days[0];
  let end = days[0];

  for (let i = 1; i < days.length; i++) {
    const current = days[i];
    if (order.indexOf(current) === order.indexOf(end) + 1) {
      end = current;
    } else {
      ranges.push(start === end ? start : `${start}–${end}`);
      start = end = current;
    }
  }
  ranges.push(start === end ? start : `${start}–${end}`);
  return ranges.join(', ');
}

function copySignature() {
  const sigDetails = document.getElementById("sigDetails");
  const sigLogo = document.querySelector(".sig-logo");

  const tempDiv = document.createElement("div");
  tempDiv.style.fontFamily = "Arial, sans-serif";
  tempDiv.style.fontSize = "14px";
  tempDiv.style.lineHeight = "1.4";
  tempDiv.style.background = "none";
  tempDiv.style.border = "none";

  tempDiv.innerHTML = `
    <div>${sigDetails.innerHTML}</div>
    <div>${sigLogo.innerHTML}</div>
  `;

  document.body.appendChild(tempDiv);

  const range = document.createRange();
  range.selectNode(tempDiv);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  try {
    document.execCommand("copy");
    alert("Signature copied to clipboard!");
  } catch (err) {
    alert("Failed to copy. Try selecting manually.");
  }

  document.body.removeChild(tempDiv);
}


// Optional: Attach updateSignature to inputs dynamically (if you don't use oninput inline)
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("input, select").forEach(el => {
    el.addEventListener("input", updateSignature);
  });
});
