// loder
window.addEventListener("load", function () {
  let loader = document.getElementById("preloader");
  loader.classList.add("noo");
  document.body.style.overflow = "visible";
});

let urlPosts = "https://backend.waterleaksksa.com/api/admin/posts/";
let urlComents = "https://backend.waterleaksksa.com/api/";

function getPostsData() {
  let getID = new URLSearchParams(window.location.search).get("id");
  let postsContainer = document.getElementById("postContent");
  let miniNavTitle = document.getElementById("mini-nav-title");
  let miniNavCat = document.getElementById("mini-nav-cat");
  axios.get(`${urlPosts}${getID}`).then((Response) => {
    console.log(Response.data.data);

    document.querySelector(
      "meta[name='description']"
    ).content = `${Response.data.data.description}`;
    document.title = `${Response.data.data.title}`;

    miniNavCat.innerHTML = `${Response.data.data.category.name}`;
    miniNavTitle.innerHTML = `${Response.data.data.title}`;
    postsContainer.innerHTML = `
        ${Response.data.data.content}
        `;
  }).catch((error) => {
    console.error(error)
    window.location.href = "404.html";
  })
}
getPostsData();

/*
function getComments() {
  let getID = new URLSearchParams(window.location.search).get("id");
  let commentsContainer = document.getElementById("commentsContainer");
  let token = localStorage.getItem("token");

  const hedaers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  axios.get(`${urlComents}ratings/3`, {headers : hedaers}).then((Response) => {
    console.log(Response.data.data);
    Response.data.data.forEach((element) => {
      commentsContainer.innerHTML += `
            <div class="comment">
            <div class="comment-user">
              <img src="" alt="user">
              <h3>${element.name}</h3>
            </div>
            <p>${element.comment}</p>
          </div>
            `;
    });
  });
}
getComments()
*/
