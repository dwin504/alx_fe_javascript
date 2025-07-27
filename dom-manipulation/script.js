// Initial list of quotes
const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

// Get DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Use innerHTML as required
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>Category: ${quote.category}</small>`;
}

// Function to add a new quote
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please enter both a quote and category.");
    return;
  }

  const newQuote = {
    text: quoteText,
    category: quoteCategory
  };

  quotes.push(newQuote);

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("New quote added!");
}

// Event listener for the "Show New Quote" button
newQuoteBtn.addEventListener("click", showRandomQuote);
