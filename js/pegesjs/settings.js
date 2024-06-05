window.addEventListener("load", () => {
  handleLoader();
  setupCloseModalListeners();
  setipUi();
  setipSetingUi();
});

const API_URL = "https://backend.waterleaksksa.com/api/";

// Get data from local storage
const getStrg = (key) => JSON.parse(localStorage.getItem(key));

const handleLoader = () => {
  const loader = document.getElementById("preloader");
  loader.classList.add("noo");
  document.body.style.overflow = "visible";
};

const setupCloseModalListeners = () => {
  const closeModalButtons = [
    { buttonId: "closeBtn", modalId: "logoutModal" },
    { buttonId: "closechangeNameModal", modalId: "changeNameModal" },
    { buttonId: "closechangeEmailModal", modalId: "changeEmailModal" },
    { buttonId: "closedeleteProfileModal", modalId: "deleteProfileModal" },
    { buttonId: "closechangePassModal", modalId: "changePassModal" },
  ];

  closeModalButtons.forEach(({ buttonId, modalId }) => {
    document.getElementById(buttonId).addEventListener("click", () => {
      bootstrap.Modal.getInstance(document.getElementById(modalId)).hide();
    });
  });
};

const setipUi = () => {
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const image = getStrg("image") || "../../imges/avatar.jpg";
  const navSign = document.getElementById("nav-sign");

  navSign.innerHTML = token
    ? `
    <div class="user-info">
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
      `
    : `
        <li class="nav-item">
          <a class="nav-link link5" href="./pages/signup.html">انشئ حساب</a>
        </li>
        <li class="nav-item">
          <a class="nav-link log-in" data-bs-toggle="modal" data-bs-target="#logInModal">تسجيل الدخول</a>
        </li>
      `;
};

const setipSetingUi = () => {
  const img = document.getElementById("profileimg");
  const newimage = getStrg("image") || "../../imges/avatar.jpg";

  img.innerHTML = `
    <img width="150" height="150" class="img-profile" src="${newimage}" alt="profile image">
  `;
};

const acteveSidbar = () => {
  const sidbar = document.getElementById("sidbar");
  sidbar.classList.add("active");
};

const closeSidbar = () => {
  const sidbar = document.getElementById("sidbar");
  sidbar.classList.remove("active");
};

// Log out
const logOut = () => {
  localStorage.clear();
  setipUi();
  closeSidbar();
  bootstrap.Modal.getInstance(document.getElementById("logoutModal")).hide();
  appendAlert("تم تسجيل الخروج بنجاح", "success");
  location.replace("../../index.html");
};

const changeName = () => {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const image = localStorage.getItem("image").split("/").pop();
  const newName = document.getElementById("change-name").value;

  if (newName.length < 3) {
    appendAlert("الاسم غير صحيح", "danger");
    return;
  }

  const params = { full_name: newName, email, image };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  axios
    .patch(`${API_URL}user/update`, params, { headers })
    .then((response) => {
      localStorage.setItem("name", response.data.data.full_name);
      setipUi();
      bootstrap.Modal.getInstance(
        document.getElementById("changeNameModal")
      ).hide();
      appendAlert("تم تغيير الاسم بنجاح", "success");
    })
    .catch((error) => {
      if (error.response.status === 400) {
        appendAlert("يرجي التاكد من ادخال اسم صحيح", "danger");
      }
    });
};

const changeEmail = () => {
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const image = localStorage.getItem("image").split("/").pop();
  const newEmail = document.getElementById("change-email").value;
  const params = { full_name: name, email: newEmail, image };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  axios
    .patch(`${API_URL}user/update`, params, { headers })
    .then((response) => {
      localStorage.setItem("email", response.data.data.email);
      bootstrap.Modal.getInstance(
        document.getElementById("changeEmailModal")
      ).hide();
      appendAlert("تم تغيير البريد الالكتروني بنجاح", "success");
    })
    .catch((error) => {
      if (error.response.status === 400) {
        const message =
          error.response.data.message === "The email has already been taken."
            ? "البريد الالكتروني مستخدم"
            : "تأكد من صحة البريد الالكتروني";
        appendAlert(message, "danger");
      }
    });
};

const deleteProfile = () => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  axios
    .delete(`${API_URL}delete`, { headers })
    .then(() => {
      localStorage.clear();
      appendAlert("تم حذف الحساب بنجاح", "success");
      setTimeout(() => {
        window.location.href = "../../index.html";
      }, 1000);
    })
    .catch((error) => {
      console.error(error);
    });
};

const changePass = (btn) => {
  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const image = localStorage.getItem("image").split("/").pop();
  const email = localStorage.getItem("email");

  if (newPassword.length < 6) {
    appendAlert("كلمة المرور يجب أن تكون أكبر من 6 حروف", "danger");
    return;
  }

  if (newPassword !== confirmPassword) {
    appendAlert("كلمة المرور غير متطابقة", "danger");
    return;
  }

  const params = { full_name: name, password: newPassword, image, email };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status"></span>`;

  axios
    .patch(`${API_URL}user/update`, params, { headers })
    .then(() => {
      btn.innerHTML = "تاكيد";
      bootstrap.Modal.getInstance(
        document.getElementById("changePassModal")
      ).hide();
      appendAlert("تم تغيير كلمة المرور بنجاح", "success");
    })
    .catch((error) => {
      btn.innerHTML = "تاكيد";
      appendAlert("حدث خطأ ما", "danger");
      console.error(error);
    });
};

// Image upload function
const imageUpload = async () => {
  const imageInput = document.getElementById("changeProfaileImage");

  if (!imageInput) {
    appendAlert("حدث خطأ ما", "danger");
    return null;
  }

  const image = imageInput.files[0];
  if (!image) {
    appendAlert("لم يتم اختيار صورة", "danger");
    return null;
  }

  const validExtensions = ["png", "jpg", "jpeg"];
  const extension = image.name.split(".").pop().toLowerCase();
  if (!validExtensions.includes(extension)) {
    appendAlert("صيغة الصورة غير صحيحة", "danger");
    return null;
  }

  const formData = new FormData();
  formData.append("file", image);

  try {
    const response = await axios.post(`${API_URL}fileService`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.result;
  } catch (error) {
    appendAlert("حدث خطأ ما أثناء تحميل الصورة", "danger");
    console.error(error);
    return null;
  }
};

const imageChange = async () => {
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const newImage = await imageUpload();

  if (!newImage) return;

  const params = { full_name: name, email, image: newImage };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.patch(`${API_URL}user/update`, params, {
      headers,
    });
    localStorage.setItem("image", JSON.stringify(response.data.data.image));
    setipUi();
    setipSetingUi();
    appendAlert("تم تغيير الصورة الشخصية بنجاح", "success");
  } catch (error) {
    appendAlert("تأكد من صحة الصورة", "danger");
    console.error(error);
  }
};

const appendAlert = (message, type) => {
  const alertPlaceholder = document.getElementById("success-alert");
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="alert tab-pane show fade alert-${type} alert-dismissible" role="alert">
      <div>${message}</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
  alertPlaceholder.append(wrapper);
  setTimeout(() => {
    const closeAlert = bootstrap.Alert.getOrCreateInstance(".alert");
    closeAlert.close();
  }, 3000);
};
