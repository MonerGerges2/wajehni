function blogSearch() {
  let input = document.getElementById("searchbar").value;
  input = input.toLowerCase();
  let title = document.getElementsByClassName("card-title");
  let cardBody = document.getElementsByClassName("cards");
  for (let i = 0; i < title.length; i++) {
    if (title[i].innerHTML.toLowerCase().includes(input)) {
      cardBody[i].style.display = "block";
    } else {
      cardBody[i].style.display = "none";
    }
  }
}
