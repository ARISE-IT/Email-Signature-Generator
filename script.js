const correctPasscode = "digyourwell";

function checkPasscode() {
  const input = document.getElementById("passcodeInput").value;
  const errorText = document.getElementById("error");

  if (input === correctPasscode) {
    document.getElementById("passcodePrompt").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
  } else {
    errorText.textContent = "Incorrect passcode";
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
  ]
};

const screenshotCounts = {
  "Mail for iPhone": 7,
  "Outlook 365 for iPhone": 5,
  "Outlook 365 (Desktop) Mac": 6,
  "Apple Mail Mac": 8,
  "Chrome Outlook 365": 4
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
