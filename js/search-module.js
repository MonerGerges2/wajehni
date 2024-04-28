function blogSearch() {
  const searchTerm = document.getElementById("searchbar").value.toLowerCase();
  const titleElements = document.getElementsByClassName("card-title");
  const cardBodyElements = document.getElementsByClassName("cards");
  let foundResults = false; // Flag to track if any results are found

  for (let i = 0; i < titleElements.length; i++) {
    const titleText = titleElements[i].innerHTML.toLowerCase();
    const cardBodyElement = cardBodyElements[i];

    if (titleText.includes(searchTerm)) {
      cardBodyElement.style.display = "block";
      foundResults = true; // Set flag to true if result is found
    } else {
      cardBodyElement.style.display = "none";
    }
  }

  // Display message if no results are found
  if (!foundResults) {
    const noResultsMessage = document.getElementById("no-results-message");
    if (noResultsMessage) {
      noResultsMessage.style.display = "block";
    } else {
      // If there's no element for displaying no results message, you can create one dynamically
      const searchContainer = document.getElementById("search-container");
      const messageElement = document.createElement("p");
      messageElement.id = "no-results-message";
      messageElement.textContent = "لا توجد نتائج لعرضها...";
      searchContainer.appendChild(messageElement);
    }
  } else {
    // Hide no results message if results are found
    const noResultsMessage = document.getElementById("no-results-message");
    if (noResultsMessage) {
      noResultsMessage.style.display = "none";
    }
  }
}

