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

      appendAlert("تم تسجيل الدخول بنجاح", "success");
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      if (error) {
        console.log(error);
        appendAlert("تاكد من صحة البريد الالكتروني وكلمة المرور", "danger");
      } else appendAlert("حدث خطأ ما ، الرجاء المحاولة مرة أخرى", "danger");
    });
}

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
