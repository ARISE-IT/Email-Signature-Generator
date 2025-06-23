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
