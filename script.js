const correctPasscode = "111";
function checkPasscode() {
  const input = document.getElementById("passcodeInput").value;
  const errorText = document.getElementById("error");
  if (input === correctPasscode) {
    document.getElementById("passcodePrompt").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
  } else {
    errorText.textContent = "Incorrect passcode. Please try again.";
  }
}

function updateSignature() {
  const name = document.getElementById('fullName').value || 'Your Name';
  const role = document.getElementById('role').value || 'Your Role';
  const campus = document.getElementById('campus').value.trim();
  const phone = document.getElementById('phone').value || 'Phone';
  const email = document.getElementById('email').value || 'email@example.com';
  const location = document.getElementById('location').value || 'Your Address';
  const campusText = campus ? `${campus}` : '<span style="display:inline-block; height: 1em;"></span>';

  const days = ['Mon','Tue','Wed','Thu','Fri','Sat'];
  const dayMap = {}; // e.g., { '9:00 AM – 5:00 PM': ['Mon', 'Tue'] }

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

  const scheduleLines = [];

  for (const [timeRange, groupedDays] of Object.entries(dayMap)) {
    scheduleLines.push(`${groupedDays.join(', ')}: ${timeRange}`);
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
    <div>${campusText}</div><br>
    <div><span style="font-size: 80%;">📞</span> ${phone}</div>
    <div><span style="font-size: 80%;">📧</span> ${email}</div>
    <div><span style="font-size: 80%;">📍</span> ${location}</div>
    ${workSchedule}
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

  // Build HTML structure fresh — without copying any inherited styles
  tempDiv.innerHTML = `
    <div>${sigDetails.innerHTML}</div>
    <div>${sigLogo.innerHTML}</div>
  `;

  // Prevent copied box styling
  tempDiv.style.background = "none";
  tempDiv.style.border = "none";

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

const appOptions = {
  computer: [
    { value: "Outlook 365 (Desktop) Mac", text: "Outlook for Mac" },
    { value: "Chrome Outlook 365", text: "Outlook in Browser" },
    { value: "Apple Mail Mac", text: "Apple Mail" }
  ],
  iphone: [
    { value: "Outlook 365 for iPhone", text: "Outlook for iPhone" },
    { value: "Mail for iPhone", text: "Apple Mail" }
  ]
};

const screenshotCounts = {
  "Mail for iPhone": 7,
  "Outlook 365 for iPhone": 5,
  "Outlook 365 (Desktop) Mac": 6,
  "Apple Mail Mac": 8,
  "Chrome Outlook 365": 4
};

function updateAppDropdown() {
  const device = document.getElementById("device").value;
  const appSelect = document.getElementById("app");
  const appSection = document.getElementById("appSection");
  const screenshotGallery = document.getElementById("screenshotGallery");

  appSelect.innerHTML = "";
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
  const app = document.getElementById("app").value;
  const gallery = document.getElementById("screenshotGallery");

  gallery.innerHTML = "";

  if (!app || !screenshotCounts[app]) {
    gallery.style.display = "none";
    return;
  }

  const count = screenshotCounts[app];
  for (let i = 1; i <= count; i++) {
    const fileName = `${app} ${i}.png`;
    const img = document.createElement("img");
    img.src = `images/${fileName}`;
    img.alt = `Step ${i}`;
    gallery.appendChild(img);
  }

  gallery.style.display = "grid";
}


