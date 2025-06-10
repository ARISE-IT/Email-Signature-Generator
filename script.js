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
  const location = document.getElementById('location').value || 'Your Location';
  const workStart = document.getElementById('workStart').value;
  const workEnd = document.getElementById('workEnd').value;
  const checkedDays = Array.from(document.querySelectorAll('input[name="workDays"]:checked')).map(cb => cb.value);

  const campusText = campus ? `Arise in ${campus}` : '';

  let workScheduleText = '';
  if (checkedDays.length && workStart && workEnd) {
    workScheduleText = `<br><strong>Office Hours:</strong><br>`;
    checkedDays.forEach(day => {
      workScheduleText += `${day}: ${formatTime(workStart)} - ${formatTime(workEnd)}<br>`;
    });
  }

  document.getElementById('sigDetails').innerHTML = `
    <strong>${name}</strong><br>
    <em>${role}</em><br>
    ${campusText}<br><br>
    📞 ${phone}<br>
    📧 ${email}<br>
    📍 ${location}
    ${workScheduleText}
  `;
}

function formatTime(time) {
  if (!time) return '';
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
