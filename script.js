const correctPasscode = "1234";  // Updated passcode

const passcodePrompt = document.getElementById('passcodePrompt');
const mainContent = document.getElementById('mainContent');
const sigDetails = document.getElementById('sigDetails');

function checkPasscode() {
  const input = document.getElementById("passcodeInput").value;
  const errorText = document.getElementById("error");
  if (input === correctPasscode) {
    passcodePrompt.style.display = "none";
    mainContent.style.display = "block";
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

  // Only include "Arise in" when campus is not empty
  const campusText = campus ? `Arise in ${campus}` : '';

  const scheduleLines = getWorkSchedule();

  sigDetails.innerHTML = `
    <strong>${name}</strong><br>
    <em>${role}</em><br>
    ${campusText ? campusText + '<br>' : ''}  <!-- Conditional "Arise in" -->
    📞 ${phone}<br>
    📧 ${email}<br>
    📍 ${location}
    ${scheduleLines}
  `;
}

function getWorkSchedule() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let scheduleLines = [];

  days.forEach(day => {
    const checkbox = document.querySelector(`input[type="checkbox"][value="${day}"]`);
    const startInput = document.getElementById(`${day}Start`);
    const endInput = document.getElementById(`${day}End`);
    
    if (checkbox?.checked && startInput?.value && endInput?.value) {
      const start = formatTime(startInput.value);
      const end = formatTime(endInput.value);
      scheduleLines.push(`${day}: ${start} – ${end}`);
    }
  });

  return scheduleLines.length > 0 ? `<br><br>📅 <strong>Workdays:</strong><br>${scheduleLines.join('<br>')}` : '';
}

function formatTime(time) {
  const [hour, minute] = time.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 || 12;
  return `${h}:${minute.toString().padStart(2, '0')} ${ampm}`;
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
