let getID = new URLSearchParams(window.location.search).get("id");
let counter = 0;
let urlPosts = "https://backend.waterleaksksa.com/api/admin/posts/";
let urlComents = "https://backend.waterleaksksa.com/api/";

// loder
window.addEventListener("load", function () {
  let loader = document.getElementById("preloader");
  loader.classList.add("noo");
  document.body.style.overflow = "visible";
});

function getPostsData() {
  let getID = new URLSearchParams(window.location.search).get("id");
  let postsContainer = document.getElementById("postContent");
  let miniNavTitle = document.getElementById("mini-nav-title");
  let miniNavCat = document.getElementById("mini-nav-cat");
  axios
    .get(`${urlPosts}${getID}`)
    .then((Response) => {
      document.querySelector(
        "meta[name='description']"
      ).content = `${Response.data.data.description}`;
      document.title = `${Response.data.data.title}`;

      miniNavCat.innerHTML = `${Response.data.data.category.name}`;
      miniNavTitle.innerHTML = `${Response.data.data.title}`;
      postsContainer.innerHTML = `
        ${Response.data.data.content}
        `;
    })
    .catch((error) => {
      console.error(error);
      window.location.href = "404.html";
    });
}
getPostsData();

function getComments() {
  let commentsContainer = document.getElementById("commentsContainer");

  axios
    .get(`${urlComents}ratings?post_id=${getID}`)
    .then((Response) => {
      let comments = Response.data.data.data;
      if (comments.length === 0) {
        commentsContainer.innerHTML = `<h3> لا يوجد تعليقات... </h3>`;
        return;
      }
      for (comment of comments) {
        let starsContainer = "";
        let rate = comment.star_rating;
        for (let i = 0; i < rate; i++) {
          starsContainer += '<i class="fa-solid fa-star checked"></i>';
        }
        for (let i = 0; i < 5 - rate; i++) {
          starsContainer += '<i class="fa-regular fa-star"></i>';
        }
        commentsContainer.innerHTML += `
    <div class="comment">
    <div class="comment-user">
        <img src="${comment.user.web_image}" alt="user">
        <p> ${comment.user.full_name} </p>
    </div>
    <div class="comment-content">
        <p>
            ${!comment.comments ? "لا يوجد تعليق..." : comment.comments}
        </p>
        <span>${comment.created_at.slice(0, 10)}</span>

        <div class="rating-1">
            ${starsContainer}
        </div>

    </div>
</div>
    `;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
getComments();

function addRatingCounter() {
  let stars = document.querySelectorAll(".rating input");
  stars = Array.from(stars).reverse();
  stars.forEach((star) => {
    star.addEventListener("click", function () {
      // Uncheck all stars
      stars.forEach((s) => (s.checked = false));

      // Check this star and all stars to its left
      let clickedIndex = Array.from(stars).indexOf(this);
      counter = clickedIndex + 1;
      for (let i = 0; i <= clickedIndex; i++) {
        stars[i].checked = true;
      }
    });
  });
}
addRatingCounter();

function addRating() {
  let commentInput = document.getElementById("comment").value;
  let token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const body = {
    post_id: getID,
    comments: commentInput,
    star_rating: counter,
  };
  if (!token) {
    appendAlert("عليك تسجيل الدخول اولا", "danger");
    return;
  }
  if (counter === 0) {
    appendAlert("عليك وضع تقييم اولا", "danger");
    return;
  }
  axios
    .post(`${url}ratings`, body, { headers: headers })
    .then((response) => {
      location.reload();
    })
    .catch((error) => {
      console.error(error);
    });
}
searchButton.addEventListener("click", function (event) {
  // Prevent the default action (page reload)
  event.preventDefault();
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
