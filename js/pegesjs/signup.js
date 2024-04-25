// loder
window.addEventListener("load", function () {
  let loader = document.getElementById("preloader");
  loader.classList.add("noo");
  document.body.style.overflow = "visible";
});
const url = "https://backend.waterleaksksa.com/api/";

// image upload to server function
async function imageUpload() {
  let imag = document.getElementById("profaile-image");
  if (!imag) {
    console.error("Profile image input element not found.");
    return; // Exit function if input element is not found
  }

  let image = imag.files[0];
  if (!image) {
    console.error("No image selected.");
    return; // Exit function if no file is selected
  }

  let img = "";

  let extension = image.name.split(".").pop().toLowerCase();

  const formData = new FormData();
  formData.append("file", image);

  const headers = {
    "Content-Type": "multipart/form-data",
  };

  try {
    if (["png", "jpg", "jpeg"].includes(extension)) {
      await axios
        .post(`${url}fileService`, formData, {
          headers,
        })
        .then((response) => {
          img = response.data.result;
          appendAlert("تم رفع الصورة بنجاح", "success");
        });
    } else {
      appendAlert("صيغة الصورة غير صحيحة", "danger");
      return; // Exit function if invalid file format
    }
  } catch (error) {
    console.error("Error uploading image:", error.message);
    // Handle error appropriately
  }

  return img;
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
      // set data in local storage
      localStorage.setItem("token", Response.data.result.accessToken);
      localStorage.setItem("name", Response.data.result.full_name);
      localStorage.setItem("image", JSON.stringify(Response.data.result.image));
      localStorage.setItem("email", Response.data.result.email);

      // Hide login modal
      const modal = document.getElementById("logInModal");
      const inst = bootstrap.Modal.getInstance(modal);
      inst.hide();

      appendAlert("تم تسجيل الدخول بنجاح", "success");

      // go to home page after 1 seconds
      setInterval(() => {
        window.open("../../index.html", "_self");
      }, 1000);
    })
    .catch((error) => {
      if (error) {
        appendAlert("تاكد من صحة البريد الالكتروني وكلمة المرور", "danger");
      } else {
        appendAlert("حدث خطأ ما ، الرجاء المحاولة مرة أخرى", "danger");
      }
    });
}

// sign up function
async function signUp() {
  let nameInput = document.getElementById("full-name").value;
  let emailInput = document.getElementById("email").value;
  let passwordInput = document.getElementById("password").value;
  let confirmPasswordInput = document.getElementById("password2").value;

  // Perform input validation
  if (!nameInput || !emailInput || !passwordInput || !confirmPasswordInput) {
    appendAlert("يرجى ملء جميع الحقول", "danger");
    return;
  }

  // Validate email format
  if (!isValidEmail(emailInput)) {
    appendAlert("الرجاء إدخال بريد إلكتروني صالح", "danger");
    return;
  }

  // Validate password length or complexity if needed
  if (passwordInput !== confirmPasswordInput) {
    appendAlert("كلمة المرور غير متطابقة", "danger");
    return;
  }

  // Validate password length
  if (passwordInput.length < 8) {
    appendAlert("كلمة المرور يجب أن تكون 8 احرف على الأقل", "danger");
    return;
  }

  let image = await imageUpload();

  const params = {
    full_name: nameInput,
    email: emailInput,
    password: passwordInput,
    image: image,
  };

  axios
    .post(`${url}register`, params)
    .then((Response) => {
      localStorage.setItem("token", Response.data.data.accessToken);
      localStorage.setItem("name", Response.data.data.full_name);
      localStorage.setItem("image", JSON.stringify(Response.data.data.image));
      localStorage.setItem("email", Response.data.data.email);
      appendAlert("تم التسجيل بنجاح", "success");
      // Redirect to the home page after a short delay
      setTimeout(() => {
        window.location.href = "../../index.html";
      }, 1000);
    })
    .catch((error) => {
      if (
        error.response.status === 400 &&
        error.response.data.message == "The email has already been taken."
      ) {
        appendAlert("البريد الإلكتروني موجود مسبقًا", "danger");
      } else if (error.response.status === 400) {
        if (error.response.data.errors) {
          appendAlert("يرجى التاكد من ادخال جميع الحقول بشكل صحيح", "danger");
        } else if (error.response.data.message) {
          appendAlert(error.response.data.message, "danger");
        }
      } else {
        appendAlert("حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا", "danger");
      }
      console.error(error.response.data.message);
    });
}

function isValidEmail(email) {
  // Simple email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Add an alert to the page
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
