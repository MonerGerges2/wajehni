var url = "https://backend.waterleaksksa.com/api/admin/";
var urlImage = "https://backend.waterleaksksa.com/api/";
let getImage = "";

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

function getPost() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  // Get the value of the 'id' parameter
  const id = urlParams.get("id");
  if (!id) {
    console.error("No post ID provided.");
    return;
  }

  let headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  axios
    .get(`${url}posts/${id}`, { headers: headers })
    .then((response) => {
      let post = response.data.data;
      getImage = post.image;
      // Set the title, description, and content of the post
      document.getElementById("title").value = post.title;
      document.getElementById("description").value = post.description;

      tinymce.get("default").setContent(post.content);

      // Set the image source to the post's image
      const imagePreview = document.getElementById("image-preview");
      if (post.image) {
        imagePreview.src = post.image;
        imagePreview.style.display = "block"; // Show the image preview
      } else {
        imagePreview.style.display = "none"; // Hide the image preview if no image exists
      }

      // Set the selected category in the dropdown
      const categoriesDropdown = document.getElementById("categories");
      if (post.category && post.category.id) {
        const categoryId = post.category.id;
        for (let i = 0; i < categoriesDropdown.options.length; i++) {
          if (categoriesDropdown.options[i].value == categoryId) {
            categoriesDropdown.selectedIndex = i;
            break;
          }
        }
      }

      // Display success message or perform other actions if needed
    })
    .catch((error) => {
      console.error("Error getting post:", error.message);
      // Display error message to the user
      appendAlert("حدث خطأ أثناء جلب المنشور", "danger");
    });
}
getPost();

async function updatePost() {
  let btnAdd = document.getElementById("btn-add");
  btnAdd.innerHTML = `
  <div class="spinner-border spinner-border-sm text-light" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
  `;
  try {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const postId = urlParams.get("id");
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let content = tinymce.get("default").getContent();
    let category = document.getElementById("categories").value;
    let newImage = (await imageUpload())
      ? await imageUpload()
      : getImage.split("/").pop();

    if (!title || !description || !content || !category || !newImage) {
      appendAlert("الرجاء ملء جميع الحقول المطلوبة", "danger");
      btnAdd.innerHTML = "تعديل المقال";
      throw new Error("Please fill out all required fields.");
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

    const response = await axios.patch(`${url}posts/${postId}`, formData, {
      headers: headers,
    });
    btnAdd.innerHTML = "تعديل المقال";
    // Display success message to the user
    appendAlert("تم التعديل بنجاح", "success");

    // Redirect the user to the dashboard after a short delay
    setTimeout(() => {
      window.location.href = "../projects.html";
    }, 1000);
  } catch (error) {
    // Display error message to the user
    appendAlert("حدث خطأ ما", "danger");
    console.error("Error updating post:", error.message);
  }
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
