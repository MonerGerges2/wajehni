let url = "https://backend.waterleaksksa.com/api/";

function getData() {
  let pro = document.getElementById("projects");
  let noData = document.getElementById("noData");
  let cardsPlaceholder = document.getElementById("cards-placeholder");

  let token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  axios
    .get(`${url}admin/posts`, { headers: headers })
    .then((response) => {
      cardsPlaceholder.innerHTML = "";
      let projects = response.data.data.data;

      if (projects.length === 0) {
        // Display message when there are no posts available
        noData.innerHTML = `<p> لا يوجد مقالات... </p>`;
        return;
      } else {
        noData.style.display = "none";
      }

      for (let project of projects) {
        pro.innerHTML += `
              <div class="cards col-lg-5 col-md-12">
                  <div class="card">
                      <div class="container-img position-relative">
                          <img class="card-img-top" src="${project.image}" alt="Card image cap">
                      </div>
                      <div class="card-body">
                          <h5 class="card-title">${project.title}</h5>
                          <p class="card-text">${project.description < 250 ? project.description : project.description.slice(0, 200) + "..."}</p>
                      </div>
                      <div class="d-flex justify-content-between">
                          <button onclick="addPostId(${project.id})" class="btn btn-primary m-2"> تعديل المقال </button>
                          <button onclick="confirmDelete(${project.id})" class="btn btn-danger m-2" data-bs-toggle="modal" data-bs-target="#deletePostModal"> حذف المقال </button>
                      </div>
                  </div>
              </div>`;
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      // Display error message to the user
    });
}

getData();

function confirmDelete(id) {
  document.getElementById("deletePostId").value = id;
}
function deleteProfile() {
  let id = document.getElementById("deletePostId").value;
  let token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  axios
    .delete(`${url}admin/posts/${id}`, { headers: headers })
    .then((response) => {
      window.location.reload();
    })
    .catch((error) => {
      console.error(error);
    });
}
function addPostId(id) {
  window.location.href = "../dashboard/add-post/edit-post.html?id=" + id;
}
function checkAuthentication() {
  // Check if token exists in local storage
  const token = localStorage.getItem("token");
  if (!token) {
    // If token doesn't exist, redirect to login page or show an error message
    window.location.href = "login.html"; // Redirect to the login page
  }
}

checkAuthentication();

document
  .getElementById("closedeleteProfileModal")
  .addEventListener("click", () => {
    bootstrap.Modal.getInstance(
      document.getElementById("deletePostModal")
    ).hide();
  });

  function getUserdata() {
    let token = localStorage.getItem("token");
    let avatar = document.getElementById("avatar");
  
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    axios
      .get(`${url}user`, { headers: headers })
      .then((response) => {
        avatar.src = response.data.data.image ? response.data.data.image : "../../imges/avatar.jpg";      
      })
      .catch((error) => {
        console.error(error);
      });
  }
  getUserdata();
  
  // log out
  function logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("image");
    localStorage.removeItem("email");
    checkAuthentication();
  }
  let closeBtn = document.getElementById("closeBtn");
  closeBtn.addEventListener("click", () => {
    bootstrap.Modal.getInstance(document.getElementById("logoutModal")).hide();
  });
  