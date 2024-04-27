let url = "https://backend.waterleaksksa.com/api/";

function getUserData() {
  const token = localStorage.getItem("token");
  let profileBox = document.getElementById("profile-box");
  let avatar = document.getElementById("avatar");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  axios.get(`${url}user`, { headers: headers })
    .then(response => {
      avatar.src = response.data.data.image ? response.data.data.image : "../../imges/avatar.jpg";      
      const userData = response.data.data;
      profileBox.innerHTML = `
      <div class="avatar-box txt-c p-20">
      <img class="rad-half mb-10" src="${userData.image}" alt="" />
      <h3 class="m-0">${userData.full_name}</h3>
    </div>
    <div class="info-box w-full txt-c-mobile">
      <!-- Start Information Row -->
      <div class="box p-20 d-flex align-center">
        <h4 class="c-grey fs-15 m-0 w-full">المعلومات العامه</h4>
        <div class="fs-14">
          <span class="c-grey">الاسم :</span>
          <span>${userData.full_name}</span>
        </div>
        <div class="fs-14">
          <span class="c-grey">البلد :</span>
          <span>مصر</span>
        </div>
      </div>
      <!-- End Information Row -->
      <!-- Start Information Row -->
      <div class="box p-20 d-flex align-center">
        <h4 class="c-grey w-full fs-15 m-0">المعلومات الشخصية</h4>
        <div class="fs-14">
          <span class="c-grey">البريد الالكتروني :</span>
          <span>${userData.email}</span>
        </div>
        <div class="fs-14">
          <span class="c-grey">تاريخ انشاء الحساب :</span>
          <span>25/10/1982</span>
        </div>
      </div>
      <!-- End Information Row -->
    </div>
  </div>
      `;
    })
    .catch(error => {
      console.error("Error fetching user data:", error);
    });
  
}
getUserData();
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

function checkAuthentication() {
  // Check if token exists in local storage
  const token = localStorage.getItem("token");
  if (!token) {
    // If token doesn't exist, redirect to login page or show an error message
    window.location.href = "../../dashboard/login.html"; // Redirect to the login page
  }
}
checkAuthentication();

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