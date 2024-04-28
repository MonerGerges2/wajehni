let urlCat = "https://backend.waterleaksksa.com/api/admin/";

function getCategories() {
  let division = document.getElementById("division");
  let token = localStorage.getItem("token");
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

function getPostsTitle(id) {
  let postTitle = document.getElementById("Specialization");
  let select1 = document.getElementById("select1");

  axios
    .get(`${urlCat}posts?category_id=${id}`)
    .then((response) => {
      let Posts = response.data.data.data;
      console.log(Posts);
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
