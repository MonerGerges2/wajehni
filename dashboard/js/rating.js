let url = "https://backend.waterleaksksa.com/api/";

function checkAuthentication() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.replace("login.html");
  }
}
checkAuthentication();

function getRatings() {
  let table = document.getElementById("rating-table");
  let spinner = document.getElementById("spinner");
  let token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  axios
    .get(`${url}ratings?limit=1`, { headers: headers })
    .then((response) => {
      spinner.innerHTML = "";
      table.innerHTML = "";
      let ratings = response.data.data.data;
      if (ratings.length === 0) {
        table.innerHTML = `<tr><td class="text-center" colspan="8">لا يوجد تقييمات...</td></tr>`;
      }
      for (let rating of ratings) {
        table.innerHTML += `
         <tr>
           <td>${
             rating.post.title.length < 15
               ? rating.post.title
               : rating.post.title.slice(0, 15) + "..."
           }</td>
           <td>${rating.created_at.slice(0, 10)}</td>
           <td>${!rating.comments ? "لا يوجد محتوي..." : rating.comments}</td>
           <td>${rating.star_rating}</td>
           <td>
           <span class="label btn-shape ${
             rating.status == "active" ? "bg-green" : "bg-orange"
           } c-white">${rating.status}</span>
           </td>
           <td>
           <button id="active-${rating.id}" onClick="activeRating(${rating.id}, ${rating.post_id})" 
        class="btn-shape b-none bg-blue c-white">نشر</button>
         </td>
         <td>
           <button id="inactive-${rating.id}" onClick="inactiveRating(${rating.id}, ${
          rating.post_id
        })" class="btn-shape b-none bg-orange c-white">اخفاء</button>
         </td>
         <td>
           <button id="delete-${rating.id}" onClick="deleteRating(${
             rating.id
           })" class="btn-shape b-none bg-red c-white">حذف</button>
         </td>
         </tr>`;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
getRatings();

function activeRating(ratingId, postId) {
  let token = localStorage.getItem("token");
  let element = document.getElementById(`active-${ratingId}`);
  element.disabled = true;
  element.innerHTML = `
  <div class="spinner-border spinner-border-sm text-light" role="status">
    <span class="sr-only">Loading...</span>
  </div>`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const bodyData = {
    post_id: postId,
    status: "active",
  };
  axios
    .patch(`${url}ratings/${ratingId}`, bodyData, { headers })
    .then(() => {
      element.disabled = false;
      element.innerHTML = "نشر";
      appendAlert("تم نشر التقييم بنجاح", "success");
      getRatings();
    })
    .catch((error) => {
      element.disabled = false;
      element.innerHTML = "نشر";
      console.error(error);
    });
}

function inactiveRating(ratingId, postId) {
  let token = localStorage.getItem("token");
  let element = document.getElementById(`inactive-${ratingId}`);
  element.disabled = true;
  element.innerHTML = `
  <div class="spinner-border spinner-border-sm text-light" role="status">
    <span class="sr-only">Loading...</span>
  </div>`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const bodyData = {
    post_id: postId,
    status: "inactive",
  };
  axios
    .patch(`${url}ratings/${ratingId}`, bodyData, { headers })
    .then(() => {
      element.disabled = false;
      element.innerHTML = "اخفاء";
      appendAlert("تم اخفاء التقييم بنجاح", "success");
      getRatings();
    })
    .catch((error) => {
      element.disabled = false;
      element.innerHTML = "اخفاء";
      console.error(error);
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

function deleteRating(ratingId) {
  let token = localStorage.getItem("token");
  let element = document.getElementById(`delete-${ratingId}`);
  element.disabled = true;
  element.innerHTML = `
  <div class="spinner-border spinner-border-sm text-light" role="status">
    <span class="sr-only">Loading...</span>
  </div>`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  axios
    .delete(`${url}ratings/${ratingId}`, { headers })
    .then(() => {
      element.disabled = false;
      element.innerHTML = "حذف";
      appendAlert("تم حذف التقييم بنجاح", "success");
      getRatings();
    })
    .catch((error) => {
      element.disabled = false;
      element.innerHTML = "حذف";
      console.error(error);
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
    .get(`${url}user`, { headers: headers })
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

function logOut() {
  ["token", "name", "image", "email"].forEach((item) =>
    localStorage.removeItem(item)
  );
  appendAlert("تم تسجيل الخروج بنجاح", "success");
  checkAuthentication();
}

document.getElementById("closeBtn").addEventListener("click", () => {
  bootstrap.Modal.getInstance(document.getElementById("logoutModal")).hide();
});
