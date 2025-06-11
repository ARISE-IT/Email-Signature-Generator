const correctPasscode = "1234";
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
  const campusText = campus ? `${campus}` : '';

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
    workSchedule = `<br><br>📅 <strong>Workdays:</strong><br>${scheduleLines.join('<br>')}`;
  }

  document.getElementById('sigDetails').innerHTML = `
    <strong>${name}</strong>
    <em>${role}</em>
    ${campusText}<br>
    📞 ${phone}
    📧 ${email}
    📍 ${location}
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
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = document.getElementById("signature").innerHTML;
  document.body.appendChild(tempDiv);
  const range = document.createRange();
  range.selectNode(tempDiv);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  try {
    document.execCommand("copy");
    alert("Signature copied to clipboard!");
  } catch (err) {
    alert("Failed to copy. Try selecting and copying manually.");
  }
  document.body.removeChild(tempDiv);
}
