function checkPasscode() {
  const input = document.getElementById("passcodeInput").value;
  if (input === "arise") {
    document.getElementById("passcodePrompt").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
  } else {
    alert("Incorrect passcode");
  }
}

function updateSignature() {
  const name = document.getElementById("fullName").value;
  const role = document.getElementById("role").value;
  const campus = document.getElementById("campus").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const location = document.getElementById("location").value;

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const schedule = [];

  days.forEach(day => {
    const checked = document.querySelector(`input[type=checkbox][value=${day}]`).checked;
    if (checked) {
      const start = document.getElementById(day + "Start").value;
      const end = document.getElementById(day + "End").value;
      if (start && end) {
        schedule.push(`${day} ${start}-${end}`);
      } else {
        schedule.push(day);
      }
    }
  });

  const sig = `
<strong>${name}</strong>
<em>${role}</em>

${campus}

${phone}
${email}
${location}

${schedule.length > 0 ? "Work Hours: " + schedule.join(", ") : ""}
  `;

  document.getElementById("sigDetails").innerText = sig.trim();
}

function copySignature() {
  const range = document.createRange();
  range.selectNode(document.getElementById("sigDetails"));
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
  alert("Signature copied to clipboard");
}
