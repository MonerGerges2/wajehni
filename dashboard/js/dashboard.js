const API_URL = "https://backend.waterleaksksa.com/api/";
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

// Check token validity
function checkTokenValidity() {
  const token = localStorage.getItem("token");
  if (!token) {
    redirectToLogin();
    return;
  }

  axios
    .get(`${API_URL}user`, { headers })
    .then((response) => {
      if (response.status !== 200) {
        handleInvalidToken();
      }
    })
    .catch((error) => {
      console.error("Token validation error:", error);
    });
}

function handleInvalidToken() {
  localStorage.removeItem("token");
  redirectToLogin();
}

function redirectToLogin() {
  window.location.href = "login.html";
}

function fetchData(endpoint, callback) {
  axios
    .get(`${API_URL}${endpoint}`, { headers })
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => {
      console.error(`Error fetching ${endpoint}:`, error);
    });
}

function updateCategoryData(data) {
  const categoryLength = document.getElementById("category-length");
  const categ = document.getElementById("categ");
  const categories = data.data.data;

  categ.innerHTML = "";
  categories.forEach((category) => {
    categ.innerHTML += `
      <div class="items d-flex space-between pt-15 pb-15">
        <span>${category.name}</span>
        <span class="bg-eee fs-13 btn-shape">${category.posts_count}</span>
      </div>`;
  });

  categoryLength.innerHTML = `
    <i class="fa-regular fa-circle-check fa-2x mb-10 c-green"></i>
    <span class="d-block c-black fw-bold fs-25 mb-5">${data.data.items_count}</span>
    عدد الشعب`;
}

function updatePostsData(data) {
  const recent = document.getElementById("recent");
  const postCont = document.getElementById("post-cont");
  const posts = data.data.data;
  recent.innerHTML = "";
  posts.slice(0, 3).forEach((post) => {
    recent.innerHTML += `
      <div class="news-row d-flex align-center mt-15">
        <img src="${post.image}" alt="" />
        <div class="info mr-10">
          <h3>${
            post.title.length < 20
              ? post.title
              : post.title.slice(0, 20) + "..."
          }</h3>
          <p class="m-0 fs-14 c-grey mw dis">${
            post.description.length < 100
              ? post.description
              : post.description.slice(0, 100) + "..."
          }</p>
        </div>
        <div class="btn-shape bg-eee fs-13 label">${post.created_at.slice(
          0,
          10
        )}</div>
      </div>`;
  });

  postCont.innerHTML = `
    <i class="fa-regular fa-rectangle-list fa-2x mb-10 c-orange"></i>
    <span class="d-block c-black fw-bold fs-25 mb-5">${data.data.items_count}</span>
    عدد المقالات`;
}

function updateUserData(data) {
  const welcome = document.getElementById("welcome");
  const avatar = document.getElementById("avatar");
  const user = data.data;

  avatar.src = user.image ? user.image : "../../imges/avatar.jpg";
  welcome.innerHTML = `
    <div class="intro p-20 d-flex space-between bg-eee">
      <div>
        <h2 class="m-0">مرحبا.</h2>
        <p class="c-grey mt-5">${user.full_name}</p>
      </div>
      <img class="hide-mobile" src="imgs/welcome.png" alt="" />
    </div>
    <img src="${user.image}" alt="" class="avatar" />
    <div class="body txt-c d-flex p-20 mt-20 mb-20 block-mobile">
      <div>${user.full_name}<span class="d-block c-grey fs-14 mt-10">الاسم</span></div>
    </div>
    <div class="body txt-c d-flex p-20 mt-20 mb-20 block-mobile">
      <div>${user.email}<span class="d-block c-grey fs-14 mt-10">البريد الالكتروني</span></div>
      <div>${user.guard}<span class="d-block c-grey fs-14 mt-10">الصلاحية</span></div>
    </div>`;
}

function updateRatingsData(data) {
  const ratingLength = document.getElementById("rating-length");
  const table = document.getElementById("rating-table");
  const spinner = document.getElementById("spiner")
  const ratings = data.data.data.slice(0, 10);

  spinner.innerHTML = "";
  if (ratings.length === 0) {
    table.innerHTML = `<tr><td colspan="4" class="txt-c">لا يوجد تقييمات...</td></tr>`;
  } else {
    ratings.forEach((rating) => {
      table.innerHTML += `
        <tr>
          <td>${rating.user.full_name}</td>
          <td>${rating.created_at.slice(0, 10)}</td>
          <td>${rating.comments || "لا يوجد محتوي..."}</td>
          <td>
            <span class="label btn-shape ${
              rating.status === "active" ? "bg-green" : "bg-orange"
            } c-white">${rating.status}</span>
          </td>
        </tr>`;
    });
  }

  ratingLength.innerHTML = `
    <i class="fa-regular fa-star fa-2x mb-10 c-red"></i>
    <span class="d-block c-black fw-bold fs-25 mb-5">${data.data.data.length}</span>
    عدد التقيمات`;
}

function logOut() {
  ["token", "name", "image", "email"].forEach((item) =>
    localStorage.removeItem(item)
  );
  appendAlert("تم تسجيل الخروج بنجاح", "success");
  redirectToLogin();
}

document.getElementById("closeBtn").addEventListener("click", () => {
  bootstrap.Modal.getInstance(document.getElementById("logoutModal")).hide();
});

function appendAlert(message, type) {
  const alertPlaceholder = document.getElementById("success-alert");
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="alert tab-pane show fade alert-${type} alert-dismissible" role="alert">
      <div>${message}</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  alertPlaceholder.append(wrapper);
  setTimeout(() => {
    const closeAlert = bootstrap.Alert.getOrCreateInstance(".alert");
    closeAlert.close();
  }, 3000);
}

// Check token validity on page load
document.addEventListener("DOMContentLoaded", () => {
  checkTokenValidity();
  fetchData("admin/postCategories", updateCategoryData);
  fetchData("admin/posts", updatePostsData);
  fetchData("user", updateUserData);
  fetchData("ratings", updateRatingsData);
});
