let urlPosts = "https://backend.waterleaksksa.com/api/";

function getPostsData() {
  let cards = document.getElementById("cards");
  let cardLode = document.getElementById("card-lode")

  axios.get(`${urlPosts}admin/posts`).then((response) => {
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
                <h5 class="card-title"> ${post.title} </h5>
                <p class="card-text">
                    ${post.description}
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
  window.location.href = "../pages/posts.html?id=" + id;
}