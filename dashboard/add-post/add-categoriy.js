let url = "https://backend.waterleaksksa.com/api/admin/";

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
                <button onclick="getID(${category.id})" data-bs-toggle="modal" data-bs-target="#editCategoryModal" class="btn btn-primary" id="edit-category">تعديل</button>
                <button onclick="getID(${category.id})" data-bs-toggle="modal" data-bs-target="#deleteCategoryModal" class="btn btn-danger me-2" id="delete-category">حذف</button>
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

function addCategory() {
  let categoryInput = document.getElementById("categoriyName");
  let token = localStorage.getItem("token");
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
      console.log(response);
      appendAlert("تم اضافة الشعبة بنجاح", "success");
      getCategories();
    })
    .catch((error) => {
      console.error(error);
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
    .patch(`${url}postCategories/${id}`, data , { headers: headers })
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