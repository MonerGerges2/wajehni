let url = "https://backend.waterleaksksa.com/api/admin/";
let url2 = "https://backend.waterleaksksa.com/api/";

function getCategories() {
  let categoriesElement = document.getElementById("categories");
  if (!categoriesElement) {
    console.error("Categories element not found.");
    return;
  }

  let token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  axios
    .get(`${url}postCategories`, { headers: headers })
    .then((response) => {
      let categories = response.data.data.data;
      if (categories.length === 0) {
        // Display message when there are no categories available
        categoriesElement.innerHTML = `<p> لا توجد فئات... </p>`;
        return;
      } else {
        categoriesElement.innerHTML = "";
      }

      let categoriesHtml = "";
      for (let category of categories) {
        categoriesHtml += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <span class="badge bg-primary rounded-pill">${category.name}</span>
            <div>
                <button onclick="getID(${category.id})" data-bs-toggle="modal" data-bs-target="#editCategoryModal" class="btn btn2 btn-primary" id="edit-category">تعديل</button>
                <button onclick="getID(${category.id})" data-bs-toggle="modal" data-bs-target="#deleteCategoryModal" class="btn btn2 btn-danger me-2" id="delete-category">حذف</button>
            </div>
        </li>
                `;
      }
      categoriesElement.innerHTML += categoriesHtml;
    })
    .catch((error) => {
      console.error("Error fetching categories:", error);
      // Display error message to the user
      categoriesElement.innerHTML = `<p>حدث خطأ أثناء جلب الفئات. يرجى المحاولة مرة أخرى في وقت لاحق.</p>`;
    });
}

getCategories();

function addCategory(btn) {
  let categoryInput = document.getElementById("categoriyName");
  let token = localStorage.getItem("token");
  btn.innerHTML = `
  <div class="spinner-border spinner-border-sm text-light" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
  `;
  if (!categoryInput.value) {
    btn.innerHTML = "اضافة";
    appendAlert("الرجاء إدخال اسم الفئة", "danger");
    return;
  }
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const data = {
    name: categoryInput.value,
  };
  axios
    .post(`${url}postCategories`, data, { headers: headers })
    .then((response) => {
      btn.innerHTML = "اضافة";
      appendAlert("تم اضافة الشعبة بنجاح", "success");
      getCategories();
    })
    .catch((error) => {
      btn.innerHTML = "اضافة";
      console.error(error);
      appendAlert("حدث خطأ أثناء إضافة الفئة. يرجى المحاولة مرة أخرى في وقت لاحق.", "danger");
    });
}

function getID(id) {
  document.getElementById("deleteCategoryId").value = id;
  document.getElementById("editCategoryId").value = id;
}

function deleteCategory() {
  let id = document.getElementById("deleteCategoryId").value;
  let token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  axios
    .delete(`${url}postCategories/${id}`, { headers: headers })
    .then((response) => {
      console.log(response);
      // Display success message to the user
      appendAlert("تم حذف الشعبة بنجاح", "success");
      // Refresh the list of categories
      getCategories();
      // Close the delete category modal if needed
      let deleteCategoryModal = bootstrap.Modal.getInstance(
        document.getElementById("deleteCategoryModal")
      );
      deleteCategoryModal.hide();
    })
    .catch((error) => {
      console.error("Error deleting category:", error);
      // Display error message to the user
      alert("حدث خطأ أثناء حذف الشعبة. يرجى المحاولة مرة أخرى في وقت لاحق.");
    });
}

function closeDeleteCategoryModal() {
  let deleteCategoryModal = bootstrap.Modal.getInstance(
    document.getElementById("deleteCategoryModal")
  );
  deleteCategoryModal.hide();
}
function closeEditCategoryModal() {
  let deleteCategoryModal = bootstrap.Modal.getInstance(
    document.getElementById("editCategoryModal")
  );
  deleteCategoryModal.hide();
}


function editCategory() {
  let id = document.getElementById("editCategoryId").value;
  let name = document.getElementById("deleteCategoryInput").value;
  let token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const data = {
    name: name,
  };
  axios
    .patch(`${url}postCategories/${id}`, data, { headers: headers })
    .then((response) => {
      let deleteCategoryModal = bootstrap.Modal.getInstance(
        document.getElementById("editCategoryModal")
      );
      deleteCategoryModal.hide();
      getCategories();
      appendAlert("تم تعديل الفئة بنجاح", "success");
    })
    .catch((error) => {
      console.error("Error fetching category:", error);
    });
}

function getUserdata() {
  let token = localStorage.getItem("token");
  let avatar = document.getElementById("avatar");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  axios
    .get(`${url2}user`, { headers: headers })
    .then((response) => {
      avatar.src = response.data.data.image || "../../imges/avatar.jpg";      
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