let url = "https://backend.waterleaksksa.com/api/";

getUserData();
async function getUserData() {
  const token = localStorage.getItem("token");
  let emailInput = document.getElementById("email");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.get(`${url}user`, { headers: headers });
    const userData = response.data.data;
    emailInput.value = userData.email;
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}
async function changeName() {
  try {
    const userData = await getUserData();
    const token = localStorage.getItem("token");
    const newName = document.getElementById("changename").value;

    const imageUrl = userData.image;
    const parts = imageUrl.split("/");
    const filename = parts[parts.length - 1];

    // Validate input
    if (newName.length < 3) {
      appendAlert("الاسم يجب أن يتكون من ثلاثة أحرف على الأقل", "danger");
      return; // Stop execution if input is invalid
    }
    console.log(userData.image);
    const params = {
      full_name: newName,
      email: userData.email,
      image: filename,
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.patch(`${url}user/update`, params, {
      headers: headers,
    });

    // Update local storage on success
    localStorage.removeItem("name");
    localStorage.setItem("name", response.data.data.full_name);
    localStorage.removeItem("image");
    localStorage.setItem("image", response.data.data.image);

    appendAlert("تم تغيير الاسم بنجاح", "success");
  } catch (error) {
    console.error("Error changing name:", error);

    // Handle different error scenarios
    if (error.response && error.response.status === 400) {
      appendAlert("يرجى التأكد من إدخال اسم صحيح", "danger");
    } else {
      appendAlert(
        "حدث خطأ أثناء تغيير الاسم. يرجى المحاولة مرة أخرى في وقت لاحق",
        "danger"
      );
    }
  }
}

let closedeleteProfileModal = document.getElementById("closedeleteProfileModal");
closedeleteProfileModal.addEventListener("click", () => {
  const inst = bootstrap.Modal.getInstance(deleteProfileModal);
  inst.hide();
});

function deleteProfile() {
  let token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  axios
    .delete(`${url}delete`, { headers: headers })
    .then((response) => {
      console.log(response);
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("image");
      appendAlert("تم حذف الحساب بنجاح", "success");
      setInterval(() => {
        window.location.href = "../../index.html";
      }, 1000);
    })
    .catch((error) => {
      console.error(error);
    });
}

function checkAuthentication() {
  // Check if token exists in local storage
  const token = localStorage.getItem("token");
  if (!token) {
    // If token doesn't exist, redirect to login page or show an error message
    window.location.href = "../login.html"; // Redirect to the login page
  }
}
checkAuthentication();

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
function checkAuthentication() {
  // Check if token exists in local storage
  const token = localStorage.getItem("token");
  if (!token) {
    // If token doesn't exist, redirect to login page or show an error message
    window.location.href = "../../dashboard/login.html"; // Redirect to the login page
  }
}
checkAuthentication();