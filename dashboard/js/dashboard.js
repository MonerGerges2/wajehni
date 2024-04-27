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
  let recent = document.getElementById("recent");
  let token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  axios
    .get(`${url}admin/posts`, { headers: headers })
    .then((response) => {
      
      document.getElementById("post-cont").innerHTML = response.data.data.items_count;

      let posts = response.data.data.data;
      for (post of posts) {
        recent.innerHTML += `<div class="news-row d-flex align-center mt-15">
        <img src="${post.image}" alt="" />
        <div class="info mr-10">
          <h3>${
            post.title < 50 ? post.title : post.title.slice(0, 50) + "..."
          }</h3>
          <p class="m-0 fs-14 c-grey mw" >${
            post.description < 100
              ? post.description
              : post.description.slice(0, 100) + "..."
          }</p>
        </div>
        <div class="btn-shape bg-eee fs-13 label">${post.created_at.slice(
          0,
          10
        )}
        </div>
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

function getUserdata() {
  let welcome = document.getElementById("welcome");
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
      welcome.innerHTML = `<div class="intro p-20 d-flex space-between bg-eee">
      <div>
        <h2 class="m-0">مرحبا.</h2>
        <p class="c-grey mt-5">${response.data.data.full_name}</p>
      </div>
      <img class="hide-mobile" src="imgs/welcome.png" alt="" />
    </div>
    <img src="${response.data.data.image}" alt="" class="avatar" />
    <div class="body txt-c d-flex p-20 mt-20 mb-20 block-mobile">
      <div> ${response.data.data.full_name} <span class="d-block c-grey fs-14 mt-10">الاسم</span></div>
      <div> 0 <span class="d-block c-grey fs-14 mt-10">عدد مقالاتي</span></div>
    </div>
    <div class="body txt-c d-flex p-20 mt-20 mb-20 block-mobile">
      <div> ${response.data.data.email} <span class="d-block c-grey fs-14 mt-10">البريد الالكتروني</span></div>
      <div> ${response.data.data.guard} <span class="d-block c-grey fs-14 mt-10">الصلاحية</span></div>
    </div>`;
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
  appendAlert("تم تسجيل الخروج بنجاح", "success");
  checkAuthentication();
}
let closeBtn = document.getElementById("closeBtn");
closeBtn.addEventListener("click", () => {
  bootstrap.Modal.getInstance(document.getElementById("logoutModal")).hide();
});

function appendAlert(message, type) {
  const alertPlaceholder = document.getElementById("success-alert");
  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div class="alert tab-pane show fade alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    "</div>",
  ].join("");
  alertPlaceholder.append(wrapper);
  setTimeout(() => {
    const closeAlert = bootstrap.Alert.getOrCreateInstance(".alert");
    closeAlert.close();
  }, 3000);
}

