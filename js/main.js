// loder
window.addEventListener("load", function () {
  let loader = document.getElementById("preloader");
  loader.classList.add("noo");
  document.body.style.overflow = "visible";
});
const url = "https://backend.waterleaksksa.com/api/";

// Login function
function loginBtn() {
  let emailInput = document.getElementById("log-in-email").value;
  let passwordInput = document.getElementById("log-in-password").value;

  // Perform input validation
  if (!emailInput || !passwordInput) {
    appendAlert("يرجى إدخال البريد الإلكتروني وكلمة المرور", "danger");
    return;
  }

  const params = {
    email: emailInput,
    password: passwordInput,
  };
  axios
    .post(`${url}login`, params)
    .then((Response) => {
      localStorage.setItem("token", Response.data.result.accessToken);
      localStorage.setItem("name", Response.data.result.full_name);
      localStorage.setItem("image", JSON.stringify(Response.data.result.image));
      localStorage.setItem("email", Response.data.result.email);

      const modal = document.getElementById("logInModal");
      const inst = bootstrap.Modal.getInstance(modal);
      inst.hide();
      appendAlert("تم تسجيل الدخول بنجاح", "success");
      setipUi();
    })
    .catch((error) => {
      if (error) {
        appendAlert("تاكد من صحة البريد الالكتروني وكلمة المرور", "danger");
      } else appendAlert("حدث خطأ ما ، الرجاء المحاولة مرة أخرى", "danger");
    });
}

// get data from local storage  ($param key)
function getStrg(key) {
  return JSON.parse(localStorage.getItem(key));
}

// set ui using local storage function
function setipUi() {
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const image = getStrg("image");
  let navSign = document.getElementById("nav-sign");
  if (token == null) {
    navSign.innerHTML = `
      <li class="nav-item">
        <a class="nav-link link5" href="./pages/signup.html">انشئ حساب</a>
      </li>
      <li class="nav-item">
        <a class="nav-link log-in" href="#" data-bs-toggle="modal" data-bs-target="#logInModal">تسجيل الدخول</a>
      </li>
    </ul>`;
  } else {
    navSign.innerHTML = `
      <div class="user-header ">
                  <img src="${
                    image ? image : "../imges/avatar.jpg"
                  }" alt="user-image" width="40" height="40"  class="img-profile">
                    <p class="user-name">${name}</p>
                </div>
      <div class="icon-btn">
      <a onclick="acteveSidbar()" class="iconn" href="#"> <i class="fa-solid fa-bars"></i> </a>
                </div>
    </ul>`;
  }
}

// active sidebar function
function acteveSidbar() {
  let sidbar = document.getElementById("sidbar");
  sidbar.classList.add("active");
}

// close sidebar function
function closeSidbar() {
  let sidbar = document.getElementById("sidbar");
  sidbar.classList.remove("active");
}

// show password
function showPassword(passwordInputId, confirmPasswordInputId, eyeIconId) {
  // Get input elements and eye icon
  let passwordInput = document.getElementById(passwordInputId);
  let password2Input = document.getElementById(confirmPasswordInputId);
  let eye = document.getElementById(eyeIconId);

  // Check if input elements exist
  if (!passwordInput || !eye) {
    console.error("Password input or eye icon element not found.");
    return;
  }

  // Toggle password visibility and eye icon
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  if (password2Input) {
    password2Input.type =
      password2Input.type === "password" ? "text" : "password";
  }

  if (passwordInput.type === "password") {
    eye.classList.remove("fa-eye-slash");
    eye.classList.add("fa-eye");
  } else {
    eye.classList.remove("fa-eye");
    eye.classList.add("fa-eye-slash");
  }

  // Focus on password input
  passwordInput.focus();
}

// log out
const modal = document.getElementById("logoutModal");
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
