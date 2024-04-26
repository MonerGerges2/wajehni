let url = "https://backend.waterleaksksa.com/api/";

function getData() {
  let categ = document.getElementById("categ");
  let token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  axios
    .get(`${url}admin/postCategories`, { headers: headers })
    .then((response) => {
      let categories = response.data.data.data;
      for (category of categories) {
        categ.innerHTML += `<div class="items d-flex space-between pt-15 pb-15">
        <span>${category.name}</span>
        <span class="bg-eee fs-13 btn-shape">${category.posts_count}</span>
      </div>`;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
getData();

function getPostsData() {
  let cont = document.getElementById("post-cont");
  let recent = document.getElementById("recent");
  let token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  axios
    .get(`${url}admin/posts`, { headers: headers })
    .then((response) => {
      cont.innerHTML = response.data.data.items_count;

      let posts = response.data.data.data;
      for (post of posts) {
        recent.innerHTML += `<div class="news-row d-flex align-center">
        <img src="${post.image}" alt="" />
        <div class="info mr-10">
          <h3>${post.title}</h3>
          <p class="m-0 fs-14 c-grey">${post.description}</p>
        </div>
        <div class="btn-shape bg-eee fs-13 label">${post.created_at.slice(
          0,
          10
        )}</div>
      </div>`;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
getPostsData();

function checkAuthentication() {
  // Check if token exists in local storage
  const token = localStorage.getItem("token");
  if (!token) {
    // If token doesn't exist, redirect to login page or show an error message
    window.location.href = "login.html"; // Redirect to the login page
  }
}

checkAuthentication();
