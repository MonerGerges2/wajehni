var url = "https://backend.waterleaksksa.com/api/admin/";
var urlImage = "https://backend.waterleaksksa.com/api/";

tinymce.init({
  selector: "textarea#default",
  width: "100%",
  height: 500,
  plugins: [
    "advlist",
    "autolink",
    "link",
    "image",
    "lists",
    "charmap",
    "preview",
    "anchor",
    "pagebreak",
    "searchreplace",
    "wordcount",
    "visualblocks",
    "code",
    "fullscreen",
    "insertdatetime",
    "media",
    "table",
    "emoticons",
    "template",
    "codesample",
  ],
  toolbar:
    "undo redo | styles | bold italic underline | alignleft aligncenter alignright alignjustify |" +
    "bullist numlist outdent indent | link image | print preview media fullscreen | " +
    "forecolor backcolor emoticons",
  menu: {
    favs: {
      title: "menu",
      items: "code visualaid | searchreplace | emoticons",
    },
  },
  menubar: "favs file edit view insert format tools table",
  content_style:
    "body{font-family:Helvetica,Arial,sans-serif; font-size:16px ; direction: rtl; }",
});

function getPostCategories() {
  let categoriesDiv = document.getElementById("categories");

  var url1 = `${url}postCategories`;
  let headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  axios
    .get(url1, { headers: headers })
    .then((response) => {
      let categories = response.data.data.data;
      for (category of categories) {
        categoriesDiv.innerHTML += `<option value="${category.id}">${category.name}</option>`;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
getPostCategories();

// image upload function
async function imageUpload() {
  let imag = document.getElementById("image");
  if (!imag) {
    console.error("image input element not found.");
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
      const response = await axios.post(`${urlImage}fileService`, formData, {
        headers,
      });
      img = response.data.result;
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

function previewImage(input) {
  imageUpload();
  const preview = document.getElementById("image-preview");
  const file = input.files[0];

  const reader = new FileReader();
  reader.onloadend = function () {
    preview.src = reader.result;
    preview.style.display = "block"; // Show the preview image
  };

  if (file) {
    reader.readAsDataURL(file); // Read the image file as a data URL
  } else {
    preview.src = ""; // Clear the preview image if no file is selected
    preview.style.display = "none"; // Hide the preview image
  }
}

async function addPost(btn) {
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  let content = tinymce.get("default").getContent();
  let category = document.getElementById("categories").value;
  let newImage = await imageUpload();
  btn.innerHTML = `
  <div class="spinner-border spinner-border-sm text-light" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
  `;
  if (!title || !description || !content || !category || !newImage) {
    btn.innerHTML = "نشر المقال";
    appendAlert("الرجاء ملئ جميع الحقول", "danger");
    return;
  }
  const formData = {
    title: title,
    description: description,
    image: newImage,
    content: content,
    category_id: category,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  axios
    .post(`${url}posts`, formData, { headers: headers })
    .then((response) => {
      btn.innerHTML = "نشر المقال";
      appendAlert("تمت الاضافة بنجاح", "success");
      setTimeout(() => {
        window.location.href = "../projects.html";
      }, 1000);
    })
    .catch((error) => {
      btn.innerHTML = "نشر المقال";
      appendAlert("حدث خطأ ما", "danger");
      console.error("Error adding post:", error.message);
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
    .get(`${urlImage}user`, { headers: headers })
    .then((response) => {
      avatar.src = response.data.data.image
        ? response.data.data.image
        : "../../imges/avatar.jpg";
    })
    .catch((error) => {
      console.error(error);
    });
}
getUserdata();

function checkAuthentication() {
  // Check if token exists in local storage
  const token = localStorage.getItem("token");
  if (!token) {
    // If token doesn't exist, redirect to login page or show an error message
    window.location.href = "../../dashboard/login.html"; // Redirect to the login page
  }
}
checkAuthentication();

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
