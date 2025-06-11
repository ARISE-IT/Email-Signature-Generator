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

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const selected = [];

  // Collect selected days with their time ranges
  days.forEach(day => {
    const checkbox = document.querySelector(`input[type="checkbox"][value="${day}"]`);
    const startInput = document.getElementById(`${day}Start`);
    const endInput = document.getElementById(`${day}End`);
    if (checkbox?.checked && startInput?.value && endInput?.value) {
      const start = formatTime(startInput.value);
      const end = formatTime(endInput.value);
      selected.push({ day, timeRange: `${start} – ${end}` });
    }
  });

  // Group days by identical time ranges
  const grouped = {};
  selected.forEach(entry => {
    if (!grouped[entry.timeRange]) {
      grouped[entry.timeRange] = [];
    }
    grouped[entry.timeRange].push(entry.day);
  });

  // Format grouped results
  const scheduleLines = Object.entries(grouped).map(([timeRange, dayList]) => {
    const formattedDays = collapseDays(dayList);
    return `${formattedDays} ${timeRange}`;
  });

  // Build final work schedule block
  let workSchedule = '';
  if (scheduleLines.length > 0) {
    workSchedule = `<br><br>📅 <strong>Workdays:</strong><br>${scheduleLines.join('<br>')}`;
  }

  // Update the email signature block
  document.getElementById('sigDetails').innerHTML = `
    <strong>${name}</strong><br>
    <em>${role}</em><br>
    ${campusText}<br><br>
    📞 ${phone}<br>
    📧 ${email}<br>
    📍 ${location}
    ${workSchedule}
  `;
}

// Helper to format time (e.g., 14:00 → 2:00 PM)
function formatTime(time) {
  if (!time) return '';
  const [hour, minute] = time.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 || 12;
  return `${h}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

// Helper to collapse day sequences (e.g., Mon–Fri)
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
