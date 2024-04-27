window.addEventListener("load", function () {
  let loader = document.getElementById("preloader");
  loader.classList.add("noo");
  document.body.style.overflow = "visible";
});
const url = "https://backend.waterleaksksa.com/api/";

// get data from local storage  ($param key)
function getStrg(key) {
  return JSON.parse(localStorage.getItem(key));
}

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
                    <img src="${image ? image : "../../imges/avatar.jpg"}"
                     alt="user-image" width="40" height="40"  class="img-profile">
                      <p class="user-name">${name}</p>
                  </div>
        <div class="icon-btn">
        <a onclick="acteveSidbar()" class="iconn" href="#"> <i class="fa-solid fa-bars"></i> </a>
                  </div>
      </ul>`;
  }
}

function setipSetingUi() {
  let img = document.getElementById("profileimg");
  let newimage = getStrg("image");
  img.innerHTML = `
    <img width="150" height="150" class="img-profile" src="${
      newimage ? newimage : "../../imges/avatar.jpg"
    }"
     alt="profaile image">
    `;
}

function acteveSidbar() {
  let sidbar = document.getElementById("sidbar");
  sidbar.classList.add("active");
}

function closeSidbar() {
  let sidbar = document.getElementById("sidbar");
  sidbar.classList.remove("active");
}

// log out
const modal = document.getElementById("logoutModal");
const modalchange = document.getElementById("changeNameModal");
const modalChangeEmail = document.getElementById("changeEmailModal");
const deleteProfileModal = document.getElementById("deleteProfileModal");
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
  location.replace("../../index.html");
}
let closeBtn = document.getElementById("closeBtn");
closeBtn.addEventListener("click", () => {
  const inst = bootstrap.Modal.getInstance(modal);
  inst.hide();
});

let closechangeNameModal = document.getElementById("closechangeNameModal");
closechangeNameModal.addEventListener("click", () => {
  const inst = bootstrap.Modal.getInstance(modalchange);
  inst.hide();
});

function changeName() {
  let token = localStorage.getItem("token");
  let email = localStorage.getItem("email");
  let image = localStorage.getItem("image");
  let newName = document.getElementById("change-name").value;
  const prams = {
    full_name: newName,
    email: email,
    image: image,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  if (newName.length < 3) {
    appendAlert("الاسم غير صحيح", "danger");
  } else {
    axios
      .patch(`${url}user/update`, prams, { headers: headers })
      .then((response) => {
        localStorage.removeItem("name");
        localStorage.setItem("name", response.data.data.full_name);
        setipUi();
        const inst = bootstrap.Modal.getInstance(modalchange);
        inst.hide();
        appendAlert("تم تغيير الاسم بنجاح", "success");
      })
      .catch((error) => {
        if (error.response.status == 400) {
          appendAlert("يرجي التاكد من ادخال اسم صحيح", "danger");
        }
      });
  }
}

let closechangeEmailModal = document.getElementById("closechangeEmailModal");
closechangeEmailModal.addEventListener("click", () => {
  const inst = bootstrap.Modal.getInstance(modalChangeEmail);
  inst.hide();
});

function changeEmail() {
  let token = localStorage.getItem("token");
  let name = localStorage.getItem("name");
  let image = localStorage.getItem("image");
  let newEmail = document.getElementById("change-email").value;
  const prams = {
    full_name: name,
    email: newEmail,
    image: image,
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  axios
    .patch(`${url}user/update`, prams, { headers: headers })
    .then((response) => {
      localStorage.removeItem("email");
      localStorage.setItem("email", response.data.data.email);
      const inst = bootstrap.Modal.getInstance(modalChangeEmail);
      inst.hide();
      appendAlert("تم تغيير البريد الالكتروني بنجاح", "success");
    })
    .catch((error) => {
      if (
        error.response.status == 400 &&
        error.response.data.message == "The email has already been taken."
      ) {
        appendAlert("البريد الالكتروني مستخدم", "danger");
      } else if (error.response.status == 400) {
        appendAlert("تأكد من صحة البريد الالكتروني", "danger");
        console.error(error);
      }
    });
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

// image upload function
async function imageUpload() {
  let imag = document.getElementById("changeProfaileImage");
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

  let extension = image.name.split(".").pop();

  const formData = new FormData();
  formData.append("file", image);

  const headers = {
    "Content-Type": "multipart/form-data",
  };

  try {
    if (
      extension === "png" ||
      extension === "jpg" ||
      extension === "jpeg" ||
      extension === "PNG" ||
      extension === "JPG" ||
      extension === "JPEG"
    ) {
      const response = await axios.post(`${url}fileService`, formData, {
        headers,
      });
      img = response.data.result;
      localStorage.setItem("img", JSON.stringify(img));
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

async function imageChange() {
  let token = localStorage.getItem("token");
  let name = localStorage.getItem("name");
  let email = localStorage.getItem("email");
  let newImage = await imageUpload();

  if (!newImage) {
      return; // Exit function if no new image uploaded
  }

  const params = {
      full_name: name,
      email: email,
      image: newImage,
  };

  const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
  };

  try {
      const response = await axios.patch(`${url}user/update`, params, { headers: headers });
      localStorage.removeItem("image");
      localStorage.setItem("image", JSON.stringify(response.data.data.image));
      setipUi();
      setipSetingUi();
      appendAlert("تم تغيير الصورة الشخصية بنجاح", "success");
  } catch (error) {
      if (error) {
          appendAlert("تأكد من صحة الصورة", "danger");
      }
      console.error("Error changing profile image:", error.message);
  }
}

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
setipSetingUi();
