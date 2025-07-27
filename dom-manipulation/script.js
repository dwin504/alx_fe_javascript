// === Load saved quotes or fallback ===
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

// === Save quotes to localStorage ===
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// === Show random quote (filtered by category) ===
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  let filtered = quotes;

  if (selectedCategory !== "all") {
    filtered = quotes.filter(q => q.category === selectedCategory);
  }

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes in this category.</p>`;
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `<p>"${random.text}"</p><small>Category: ${random.category}</small>`;

  sessionStorage.setItem("lastQuote", JSON.stringify(random));
}

// === Create form dynamically ===
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// === Add a new quote + update category dropdown ===
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories(); // Update dropdown if category is new
  alert("Quote added!");

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// === Populate category dropdown dynamically ===
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];

  // Clear all except "All Categories"
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Set the dropdown to last used filter
  const lastFilter = localStorage.getItem("lastFilter");
  if (lastFilter) categoryFilter.value = lastFilter;
}

// === Filter quotes when dropdown changes ===
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("lastFilter", selected);
  showRandomQuote();
}

// === Export quotes to JSON file ===
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// === Import from JSON file ===
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON structure.");
      }
    } catch {
      alert("Failed to parse JSON.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// === Show last quote if available ===
function showLastQuote() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const q = JSON.parse(last);
    quoteDisplay.innerHTML = `<p>"${q.text}"</p><small>Category: ${q.category}</small>`;
  }
}

// === Init on page load ===
newQuoteBtn.addEventListener("click", showRandomQuote);
createAddQuoteForm();
populateCategories();
showLastQuote();
