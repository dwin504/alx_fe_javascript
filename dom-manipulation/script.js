let quotes = [];
let lastViewedQuote = null;

// Load quotes from localStorage
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  if (stored) quotes = JSON.parse(stored);
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Show a random quote (filtered by category if selected)
function showRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerText = "No quotes available.";
    return;
  }

  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  document.getElementById("quoteDisplay").innerText = `"${randomQuote.text}"\n— ${randomQuote.category}`;
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

// Add a new quote from the input fields
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText && quoteCategory) {
    const newQuote = { text: quoteText, category: quoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    showRandomQuote();
    document.getElementById("newQuoteText").value = '';
    document.getElementById("newQuoteCategory").value = '';
  }
}

// Create form for adding quotes (already handled via HTML in this case)
function createAddQuoteForm() {
  // Intentionally left blank since HTML already provides the form as per instruction
}

// Populate the category filter dropdown
function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  filter.innerHTML = `<option value="all">All Categories</option>`;
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.innerText = category;
    filter.appendChild(option);
  });

  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    filter.value = savedFilter;
  }
}

// Filter quotes when category changes
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

// Export quotes to JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from uploaded JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// Simulated server data
const serverQuotes = [
  { text: "Be yourself; everyone else is already taken.", category: "Wisdom" },
  { text: "Two things are infinite: the universe and human stupidity.", category: "Humor" }
];

// Check if quote already exists
function isQuoteInList(quote, list) {
  return list.some(q => q.text === quote.text && q.category === quote.category);
}

// Conflict resolution: overwrite with server version
function handleConflict(serverQuote) {
  const index = quotes.findIndex(q => q.text === serverQuote.text);
  if (index !== -1) {
    quotes[index] = serverQuote;
    return true;
  }
  return false;
}

// Notify user of sync or conflict
function notifyUser(message) {
  const notice = document.createElement("div");
  notice.textContent = message;
  notice.style.background = "#ffeeba";
  notice.style.padding = "10px";
  notice.style.marginTop = "10px";
  notice.style.border = "1px solid #f5c6cb";
  notice.style.color = "#856404";
  document.body.insertBefore(notice, document.body.firstChild);
  setTimeout(() => notice.remove(), 5000);
}

// Simulated fetch from server (returns a promise)
function fetchFromServer() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(serverQuotes);
    }, 1000);
  });
}

// Periodic sync with server
async function syncWithServer() {
  const serverData = await fetchFromServer();
  let hasConflict = false;

  serverData.forEach(serverQuote => {
    if (!isQuoteInList(serverQuote, quotes)) {
      quotes.push(serverQuote);
      hasConflict = true;
    } else if (handleConflict(serverQuote)) {
      hasConflict = true;
    }
  });

  if (hasConflict) {
    saveQuotes();
    populateCategories();
    notifyUser("Quotes synced from server.");
    showRandomQuote();
  }
}

// Run when page loads
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  showRandomQuote();

  // Restore last viewed quote
  const lastQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastQuote) {
    const parsed = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").innerText = `"${parsed.text}"\n— ${parsed.category}`;
  }

  // Start syncing with server every 30 seconds
  setInterval(syncWithServer, 30000);
});
