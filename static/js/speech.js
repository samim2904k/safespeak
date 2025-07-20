// const micButton = document.getElementById("micButton");
// const popup = document.getElementById("popup");
// const overlay = document.getElementById("overlay");
// const closePopup = document.getElementById("closePopup");
// const textInput = document.getElementById("textInput");
// const submitBtn = document.getElementById("send-msg");


// let recognition;

// // Check if browser supports SpeechRecognition
// if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
//   const SpeechRecognition =
//     window.SpeechRecognition || window.webkitSpeechRecognition;
//   recognition = new SpeechRecognition();
//   recognition.continuous = false; // Stops after speech ends
//   recognition.interimResults = true;
//   recognition.lang = "en-US";

//   recognition.onresult = (event) => {
//     let transcript = "";
//     for (let i = event.resultIndex; i < event.results.length; i++) {
//       transcript += event.results[i][0].transcript;
//     }
//       textInput.value = transcript;
//       console.log(transcript);
//   };

//   recognition.onspeechend = () => {
//     // Speech has stopped, close the popup
//     closePopupAndStop();
//   };

//   recognition.onend = () => {
//     console.log("Speech recognition service disconnected.");
//   };

//   recognition.onerror = (event) => {
//     console.error("Speech recognition error:", event.error);
//     closePopupAndStop();
//   };
// } else {
//   alert("Your browser does not support speech recognition.");
// }

// // Open popup and start listening
// micButton.addEventListener("click", () => {
//   popup.style.display = "block";
//   overlay.style.display = "block";
//   if (recognition) recognition.start();
// });

// // Close popup and stop listening
// // closePopup.addEventListener("click", closePopupAndStop);
// overlay.addEventListener("click", closePopupAndStop);

// function closePopupAndStop() {
//   popup.style.display = "none";
//   overlay.style.display = "none";
//   if (recognition) recognition.stop();
// }
// // Enable/disable the submit button based on input
// textInput.addEventListener("input", toggleSubmitButton);

// function toggleSubmitButton() {
//   if (textInput.value.trim() !== "") {
//     submitBtn.disabled = false;
//     submitBtn.classList.add("active");
//   } else {
//     submitBtn.disabled = true;
//     submitBtn.classList.remove("active");
//   }
// }

// Elements
const micButton = document.getElementById("micButton");
const textInput = document.getElementById("textInput");
const submitBtn = document.getElementById("send-msg");
const languageList = document.querySelectorAll(".call-log-main li");
const msgcallModal = document.getElementById("msgcallModal");
const popup = document.getElementById("popup");
const overlay = document.getElementById("overlay");
const closePopup = document.getElementById("closePopup");

let recognition;
let selectedLanguage = "en-US"; // Default language

// Check if browser supports SpeechRecognition
if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false; // Stops after speech ends
  recognition.interimResults = true;
  recognition.lang = selectedLanguage;

  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    textInput.value = transcript;
    console.log("Recognized text:", transcript);
    toggleSubmitButton(); // Enable or disable submit button based on input
  };

  recognition.onspeechend = () => {
    recognition.stop();
    closePopupAndStop();
  };

  recognition.onend = () => {
    console.log("Speech recognition service disconnected.");
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    closePopupAndStop();
  };
} else {
  alert("Your browser does not support speech recognition.");
}

// Update selected language when a user clicks on a language option
languageList.forEach((item) => {
  item.addEventListener("click", () => {
    // Remove active class from all items
    languageList.forEach((li) => li.classList.remove("active"));
    
    // Add active class to the selected item
    item.classList.add("active");

    // Update the selected language
    selectedLanguage = item.getAttribute("data-language");
    console.log("Selected language:", selectedLanguage);
  });
});

// Start recognition with the selected language
micButton.addEventListener("click", () => {
  if (recognition) {
    recognition.lang = selectedLanguage; // Update the recognition language
    recognition.start();
    console.log("Speech recognition started with language:", selectedLanguage);
    openPopup();
  }
  // Close the modal
  const modalInstance = bootstrap.Modal.getInstance(msgcallModal);
  modalInstance.hide();
});

// Enable/disable the submit button based on input value
textInput.addEventListener("input", toggleSubmitButton);

function toggleSubmitButton() {
  if (textInput.value.trim() !== "") {
    submitBtn.disabled = false;
    submitBtn.classList.add("active");
  } else {
    submitBtn.disabled = true;
    submitBtn.classList.remove("active");
  }
}

// Submit button action
submitBtn.addEventListener("click", function () {
  if (textInput.value.trim()) {
    console.log("Message submitted:", textInput.value);
    textInput.value = "";
    toggleSubmitButton(); // Disable the button after submission
    closePopupAndStop();
  }
});

// Open the listening popup
function openPopup() {
  popup.style.display = "block";
  overlay.style.display = "block";
}

// Close the popup and stop recognition
function closePopupAndStop() {
  popup.style.display = "none";
  overlay.style.display = "none";
  if (recognition) recognition.stop();
}

// Close popup when overlay is clicked
overlay.addEventListener("click", closePopupAndStop);
