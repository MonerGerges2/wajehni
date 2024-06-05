// loder
window.addEventListener("load", function () {
  let loader = document.getElementById("preloader");
  loader.classList.add("noo");
  document.body.style.overflow = "visible";
});

// get data from local storage  ($param key)
function getStrg(key) {
  return JSON.parse(localStorage.getItem(key));
}

// set data to local storage and edit ui
function setipUi() {
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const image = getStrg("image");
  let navSign = document.getElementById("nav-sign");
  if (!token) {
    return;
  } else {
    navSign.innerHTML = `
    <div class="user-info d-flex">
            <div class="user-header">
                  <img src="${
                    image ? image : "../imges/avatar.jpg"
                  }" alt="user-image" width="40" height="40"  class="img-profile">
                    <p class="user-name">${name}</p>
            </div>
        <div class="icon-btn">
          <a onclick="acteveSidbar()" class="iconn"> <i class="fa-solid fa-bars"></i> </a>
        </div>
    </div>
    `;
  }
}

// set profile ui
function setipProfileUi() {
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const image = getStrg("image");
  let profile = document.getElementById("profile");

  profile.innerHTML = `
    <div class="profile-img">
                            <img width="150" height="150" class="img-profile" src="${
                              image ? image : "../../imges/avatar.jpg"
                            }"
                                alt="profaile image">
                        </div>
                        <div class="profile-name mb-4">
                            <p>${name}</p>
                        </div>
                        <div class="profile-email mb-5">
                            <p>Email : ${email}</p>
                        </div>
    `;
}

// active sidbar
function acteveSidbar() {
  let sidbar = document.getElementById("sidbar");
  sidbar.classList.add("active");
}

// close sidbar
function closeSidbar() {
  let sidbar = document.getElementById("sidbar");
  sidbar.classList.remove("active");
}

// get logout modal
const modal = document.getElementById("logoutModal");
// log out function
function logOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("name");
  localStorage.removeItem("image");
  localStorage.removeItem("email");
  setipUi();
  closeSidbar();
  const inst = bootstrap.Modal.getInstance(modal);
  inst.hide();
  appendAlert("تم تسجيل الخروج بنجاح", "success");
  window.location.href = "../../index.html";
}
let closeBtn = document.getElementById("closeBtn");
closeBtn.addEventListener("click", () => {
  const inst = bootstrap.Modal.getInstance(modal);
  inst.hide();
});

// alert function
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

setipUi();
setipProfileUi();
