let urlPosts = "https://backend.waterleaksksa.com/api/";

function getPostsData() {
  let cards = document.getElementById("cards");
  let cardLode = document.getElementById("card-lode")

  axios.get(`${urlPosts}admin/posts?category_id=13`).then((response) => {
    cardLode.innerHTML = ""
      const posts = response.data.data.data;
      if (posts.length == 0) {
        cards.innerHTML = `<div class="alert alert-danger text-center" role="alert">
        لا يوجد مقالات في هذا القسم
      </div>`;
      }
        for (post of posts) {
            cards.innerHTML += `
        <div class="cards col-lg-4 col-md-6 col-sm-12 wow fadeInUp" data-wow-duration="2s">
            <div class="card">
            <div class="container-img position-relative">
                <img loading="lazy" class="card-img-top" src="${post.image}" alt="Card image cap">
            </div>
            <div class="card-body">
                <h5 class="card-title"> ${post.title < 50 ? post.title : post.title.slice(0, 20) + "..."} </h5>
                <p class="card-text">
                    ${
                      post.description < 250 ? post.description : post.description.slice(0, 200) + "..."
                    }
                </p>
            </div>
            <a href="#" onclick="addPostId(${post.id})" class="btn card-btn"> اقرا المزيد <span><i
                        class="fa-solid fa-arrow-right-long"></i></span></a>
            </div> 
        </div>`;
      }
      
    })
    .catch((error) => {
      console.error("Error fetching posts data:", error);
    });

}
getPostsData();
function addPostId(id) {
  window.location.href = `../pages/posts.html?id=${id}`;
}

// show password
function showPassword(passwordInputId, eyeIconId) {
  // Get input elements and eye icon
  let passwordInput = document.getElementById(passwordInputId);
  let eye = document.getElementById(eyeIconId);

  // Check if input elements exist
  if (!passwordInput || !eye) {
    console.error("Password input or eye icon element not found.");
    return;
  }

  // Toggle password visibility and eye icon
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";

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
  let loadinBtn = document.getElementById("loadinBtn");

  loadinBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status"></span>`;
  // Perform input validation
  if (!emailInput || !passwordInput) {
    appendAlert("يرجى إدخال البريد الإلكتروني وكلمة المرور", "danger");
    loadinBtn.innerHTML = `تسجيل الدخول`;
    return;
  }

  const params = {
    email: emailInput,
    password: passwordInput,
  };
  axios
    .post(`${url}login`, params)
    .then((Response) => {
      loadinBtn.innerHTML = `تسجيل الدخول`;
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
        loadinBtn.innerHTML = `تسجيل الدخول`;
      } else {
        appendAlert("حدث خطأ ما ، الرجاء المحاولة مرة أخرى", "danger");
        loadinBtn.innerHTML = `تسجيل الدخول`;
      }
    });
}