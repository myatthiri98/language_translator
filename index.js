const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const exchangeIcon = document.querySelector(".exchange");
const selectTags = document.querySelectorAll("select");
const icons = document.querySelectorAll(".row i");
const translateBtn = document.querySelector("button");

selectTags.forEach((tag, id) => {
  for (let country_code in countries) {
    let selected =
      id === 0
        ? country_code === "en-GB"
          ? "selected"
          : ""
        : country_code === "my-MM"
        ? "selected"
        : "";

    let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});

exchangeIcon.addEventListener("click", () => {
  let tempText = fromText.value;
  let tempLang = selectTags[0].value;
  fromText.value = toText.value;
  toText.value = tempText;
  selectTags[0].value = selectTags[1].value;
  selectTags[1].value = tempLang;
});

fromText.addEventListener("keyup", () => {
  if (!fromText.value) {
    toText.value = "";
  }
});

translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim();
  let translateFrom = selectTags[0].value;
  let translateTo = selectTags[1].value;
  if (!text) return;
  toText.setAttribute("placeholder", "Translating...");
  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      toText.value = data.responseData.translatedText;
      data.matches.forEach((data) => {
        if (data.id === 0) {
          toText.value = data.translation;
        }
      });
      toText.setAttribute("placeholder", "Translation");
    });
});

icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    if (!fromText.value || !toText.value) return;
    const targetValue = target.getAttribute("data-target");
    if (target.classList.contains("fa-copy")) {
      if (targetValue === "from") {
        navigator.clipboard.writeText(fromText.value);
      } else if (targetValue === "to") {
        navigator.clipboard.writeText(toText.value);
      }
    } else {
      let utterance;
      if (targetValue === "from") {
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTags[0].value;
      } else if (targetValue === "to") {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTags[1].value;
      }
      speechSynthesis.speak(utterance);
    }
  });
});
