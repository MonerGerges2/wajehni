let urlCat = "https://backend.waterleaksksa.com/api/admin/";

function getCategories() {
  let division = document.getElementById("division");
  let token = localStorage.getItem("token");
  if (!token) {
    division.innerHTML = `<option class="optionn" selected disabled> يجب عليك تسجيل الدخول اولا </option>`;
    return;
  }
  let headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  axios
    .get(`${urlCat}postCategories`, { headers: headers })
    .then((response) => {
      let Categories = response.data.data.data;
      for (Categorie of Categories) {
        division.innerHTML += `
            <option value="${Categorie.id}" >${Categorie.name}</option>
            `;
      }
    })
    .catch((error) => {
      console.error(error);
    });
  division.addEventListener("change", function () {
    let selectedCategoryId = this.value;
    getPostsTitle(selectedCategoryId);
  });
}

getCategories();

let postTitle = document.getElementById("Specialization");
postTitle.innerHTML = `<option id="select1" class="optionn" selected disabled> حدد الشعبة اولا </option>`;
function getPostsTitle(id) {
  let select1 = document.getElementById("select1");
  axios
    .get(`${urlCat}posts?category_id=${id}`)
    .then((response) => {
      let Posts = response.data.data.data;
      postTitle.innerHTML = "";
      postTitle.innerHTML = `<option id="select1" class="optionn" selected disabled> اختار تخصص </option>`;

      if (Posts.length == 0) {
        postTitle.innerHTML = `<option id="select1" class="optionn" selected disabled> لا يوجد تخصصات </option>`;
        return;
      }
      select1.innerHTML = "حدد التخصص";
      for (Post of Posts) {
        postTitle.innerHTML += `
            <option value="${Post.id}" >${Post.title}</option>
            `;
      }
    })
    .catch((error) => {
      console.error(error);
    });

  let searchBtn = document.getElementById("searchBtn");
  postTitle.addEventListener("change", function () {
    let selectedPostId = this.value;
    searchBtn.addEventListener("click", function () {
      setUrl(selectedPostId);
    });
  });
}

function setUrl(id) {
  window.location.href = `../../pages/posts.html?id=${id}`;
}
function Filteriton() {
  let token = localStorage.getItem("token");
  let search = document.getElementById("search");
  if (!token) {
    search.style.display = "none";
  }else{
    search.style.display = "block";
  }
}
Filteriton()