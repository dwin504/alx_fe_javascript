let quotes = [];

// Load quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote
function showRandomQuote() {
  const display = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    display.textContent = "No quotes available.";
    return;
  }

  const selectedCategory = document.getElementById("categoryFilter")?.value || "all";
  const filtered = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    display.textContent = "No quotes in this category.";
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  display.textContent = `"${random.text}" — ${random.category}`;

  sessionStorage.setItem("lastQuote", JSON.stringify(random));
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Both quote and category are required.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();
  postQuoteToServer(newQuote);

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Create add quote form (only if dynamically needed)
function createAddQuoteForm() {
  // Already present in HTML in this case
}

// Populate category dropdown
function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  if (!filter) return;

  const selected = filter.value;
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  filter.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });

  filter.value = selected;
}

// Filter quotes by category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

// Restore selected category from localStorage
function restoreCategoryFilter() {
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory && document.getElementById("categoryFilter")) {
    document.getElementById("categoryFilter").value = savedCategory;
  }
}

// Export quotes to JSON
function exportToJsonFile() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// Fetch quotes from mock server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const serverQuotes = await response.json();

    const newQuotes = serverQuotes.map(q => ({
      text: q.title,
      category: "Server"
    }));

    quotes.push(...newQuotes);
    saveQuotes();
    populateCategories();
    filterQuotes();
    console.log("Quotes synced with server!");
  } catch (error) {
    console.error("Failed to fetch quotes from server:", error);
  }
}

// Post a quote to mock server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: quote.text,
        body: quote.category,
        userId: 1
      })
    });

    if (!response.ok) throw new Error("Failed to post");

    const result = await response.json();
    console.log("Quote posted to server:", result);
  } catch (error) {
    console.error("Error posting to server:", error);
  }
}

// Sync quotes with server
function syncQuotes() {
  fetchQuotesFromServer();
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  restoreCategoryFilter();
  showRandomQuote();

  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const parsed = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").textContent = `"${parsed.text}" — ${parsed.category}`;
  }

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
});
