function blogSearch() {
  const searchTerm = document.getElementById("searchbar").value.toLowerCase();
  const titleElements = document.getElementsByClassName("card-title");
  const cardBodyElements = document.getElementsByClassName("cards");
  let foundResults = false;

  for (let i = 0; i < titleElements.length; i++) {
    const titleText = titleElements[i].innerHTML.toLowerCase();
    const cardBodyElement = cardBodyElements[i];

    if (titleText.includes(searchTerm)) {
      cardBodyElement.style.display = "block";
      foundResults = true;
    } else {
      cardBodyElement.style.display = "none";
    }
  }

  // Display or hide the no-results message
  const noResultsMessage = document.getElementById("no-results-message");
  const searchContainer = document.getElementById("search-container");
  
  if (!foundResults) {
    if (!noResultsMessage) {
      const messageElement = document.createElement("p");
      messageElement.id = "no-results-message";
      messageElement.textContent = "لا توجد نتائج لعرضها...";
      searchContainer.appendChild(messageElement);
    } else {
      noResultsMessage.style.display = "block";
    }
  } else {
    if (noResultsMessage) {
      noResultsMessage.style.display = "none";
    }
  }
}
