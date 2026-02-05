let quotes = [];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {

    quotes = [
      { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
      { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Inspiration" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" }
    ];
    saveQuotes();
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
  if (quotes.length === 0) return;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const selectedQuote = quotes[randomIndex];

  sessionStorage.setItem("lastQuote", JSON.stringify(selectedQuote));

  quoteDisplay.innerHTML = "";

  const quoteText = document.createElement("p");
  quoteText.textContent = `"${selectedQuote.text}"`;

  const quoteCategory = document.createElement("small");
  quoteCategory.textContent = `Category: ${selectedQuote.category}`;

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text: newText, category: newCategory });
  saveQuotes();

  textInput.value = "";
  categoryInput.value = "";

  alert("Quote added successfully!");
}

function exportQuotesToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid JSON format");

      quotes.push(...importedQuotes);
      saveQuotes();

      alert("Quotes imported successfully!");
      showRandomQuote();
    } catch (err) {
      alert("Failed to import JSON: " + err.message);
    }
  };
  reader.readAsText(file);
}

newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
exportBtn.addEventListener("click", exportQuotesToJson);
importFile.addEventListener("change", importFromJsonFile);

loadQuotes();
showRandomQuote();
