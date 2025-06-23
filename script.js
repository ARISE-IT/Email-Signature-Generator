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

function copySignature() {
  const name = document.getElementById('fullName').value || 'Your Name';
  const role = document.getElementById('role').value || 'Your Role';
  const campus = document.getElementById('campus').value.trim() || 'Arise Church';
  const phone = document.getElementById('phone').value || 'Phone';
  const email = document.getElementById('email').value || 'email@example.com';
  const location = document.getElementById('location').value || 'Your Address';

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayMap = {};
  days.forEach(day => {
    const checkbox = document.querySelector(`input[type="checkbox"][value="${day}"]`);
    const startInput = document.getElementById(`${day}Start`);
    const endInput = document.getElementById(`${day}End`);
    if (checkbox?.checked && startInput?.value && endInput?.value) {
      const start = formatTime(startInput.value);
      const end = formatTime(endInput.value);
      const timeRange = `${start} – ${end}`;
      if (!dayMap[timeRange]) dayMap[timeRange] = [];
      dayMap[timeRange].push(day);
    }
  });

  const sundayChecked = document.getElementById('SundayServices')?.checked;
  const scheduleLines = [];
  for (const [range, group] of Object.entries(dayMap)) {
    scheduleLines.push(`${group.join(', ')}: ${range}`);
  }
  if (sundayChecked) scheduleLines.push("Sunday Services");

  const workSchedule = scheduleLines.length
    ? `<tr><td style="padding-top: 10px;" colspan="2"><span style="font-size: 80%;">📅</span> <strong>Workdays:</strong><br>${scheduleLines.join('<br>')}</td></tr>`
    : '';

  const signatureHTML = `
    <table style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4; border: none; background: none;">
      <tr>
        <td><strong>${name}</strong><br>
        <em>${role}</em><br>
        ${campus}<br><br>
        <span style="font-size: 80%;">📞</span> ${phone}<br>
        <span style="font-size: 80%;">📧</span> ${email}<br>
        <span style="font-size: 80%;">📍</span> ${location}</td>
      </tr>
      ${workSchedule}
      <tr><td style="padding-top: 10px;"><img src="Sig%20Logo.png" width="400" alt="Signature Logo" /></td></tr>
    </table>
  `;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = signatureHTML;
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
    alert("Failed to copy. Try selecting and copying manually.");
  }

  document.body.removeChild(tempDiv);
}

