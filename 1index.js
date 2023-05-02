import { getRender, postCom} from "./1api.js";
import { renderLoginReg, renderLoginIn } from "./components/loginComponent.js";

let commentsContainer;


const host = "https://webdev-hw-api.vercel.app/api/v2/kolesnichenko-a/comments";
let token = "Bearer ksdfsksdfjfsdjk";
token = null;

function apiGet() {
  return getRender({ token })
  .then((response) => {
    commentsContainer = response.comments;

  //   loaderStart.style.display = "none";
  //  loaderComments.style.display = "none";

   renderApp();
  });
}

apiGet();

function renderApp() {
  const appEl = document.getElementById("app");
if (!token) { 
  const commentsContainerHtml = commentsContainer
  .map((commentUser, id) => {
    return `<li data-id="${id}" class="comment">
      <div class="comment-header">
        <div>${commentUser.author.name} </div>
        <div>
          ${timeComment(commentUser.date)}
          </div>
      </div>
      <div class="comment-body">
        <div style="white-space: pre-line" class="comment-text">
          ${commentUser.text}
        </div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${commentUser.likes}</span>
          <button data-id="${id}" class="${
      commentUser.isLiked ? "like-button -active-like" : "like-button"
    }"></button>
        </div>
      </div>
    </li>`;
  })
  .join("");

  const appHtml = ` 
<div class="container">
<ul id="list" class="comments">
  ${commentsContainerHtml}
</ul>
<h4>необходимо <span id="buttonIn">войти</span> в аккаунт или <span id="buttonReg">зарегистрироваться</span></h4>
</div>`;
  appEl.innerHTML = appHtml;
  let buttonIn = document.getElementById("buttonIn");
  const buttonReg = document.getElementById("buttonReg");
  
  buttonIn.addEventListener ("click", () => {
    renderLoginIn ({ appEl, setToken: (newToken) => {
    token = newToken;
  },
  apiGet,
});

    return;
  });
  buttonReg.addEventListener ("click", () => {
    renderLoginReg({ appEl, setToken: (newToken) => {
      token = newToken;
    },
    apiGet,
  });
  
      return;
    });
} else {

  const commentsContainerHtml = commentsContainer
  .map((commentUser, id) => {
    return `<li data-id="${id}" class="comment">
      <div class="comment-header">
        <div>${commentUser.author.name} </div>
        <div>
          ${timeComment(commentUser.date)}
          </div>
      </div>
      <div class="comment-body">
        <div style="white-space: pre-line" class="comment-text">
          ${commentUser.text}
        </div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${commentUser.likes}</span>
          <button data-id="${id}" class="${
      commentUser.isLiked ? "like-button -active-like" : "like-button"
    }"></button>
        </div>
      </div>
    </li>`;
  })
  .join("");

  const appHtml = `
<div class="container">
<p id="loaderStart" class="loaderStart">ЗАГРУЗКА...</p>
<ul id="list" class="comments">
  ${commentsContainerHtml}
</ul>
<div id="loaderComments" class="loaderComments">Комментарий загружается</div>
<div id="add-form" class="add-form">
  <input id="inputName" type="text" class="add-form-name" placeholder="Введите ваше имя" />
  <textarea id="inputComment" type="textarea" class="add-form-text" placeholder="Введите ваш комментарий" rows="4"></textarea>
  <div class="add-form-row">
    <button id="buttonComent" class="add-form-button">Написать</button>
  </div>
</div>
</div>`;
  appEl.innerHTML = appHtml;

  let buttonElement = document.getElementById("buttonComent");
  const listElement = document.getElementById("list");
  const nameElement = document.getElementById("inputName");
  const commentElement = document.getElementById("inputComment");
  const likesContainerElement = document.getElementById(".likes-counter");
  const addForm = document.getElementById("add-form");
  const loaderComments = document.querySelector(".loaderComments");
  const loaderStart = document.querySelector(".loaderStart");
  
  loaderComments.style.display = "none";
  
  buttonElement.addEventListener("click", () => {
    nameElement.classList.remove("error");
    if (nameElement.value === "" || commentElement.value === "") {
      nameElement.classList.add("error");
      commentElement.classList.add("error");
      return;
    }
    buttonPost();
  });

  // function likesPlus() {
  //   const heartsElement = document.querySelectorAll(".like-button");
  
  //   for (const heartElement of heartsElement) {
  //     heartElement.addEventListener("click", (event) => {
  //       event.stopPropagation();
  //       const id = heartElement.dataset.id;
  //       if (commentsContainer[id].isLiked === false) {
  //         commentsContainer[id].isLiked = true;
  //         commentsContainer[id].likes += 1;
  //       } else if (commentsContainer[id].isLiked === true) {
  //         commentsContainer[id].isLiked = false;
  //         commentsContainer[id].likes -= 1;
  //       }
  //       renderApp();
  //     });
  //   }
  // }
  // likesPlus();
  
  // function commentsAnswer() {
  //   const commentsAnswer = document.querySelectorAll(".comment");
  //   for (const commentAnswer of commentsAnswer) {
  //     commentAnswer.addEventListener("click", () => {
  //       const index = commentAnswer.dataset.id;
  //       commentElement.value =
  //         ">" +
  //         commentsContainer[index].text +
  //         " " +
  //         commentsContainer[index].author.name +
  //         ",";
  //     });
  //   }
  // }

  // likesPlus();
  // commentsAnswer();
}
}



function buttonPost() {
  return postCom({
    text: commentElement.value,
    token
  })
    .then((response) => {
      commentElement.value = "";
      nameElement.value = "";
      apiGet();
    })
    .catch((error) => {
      if (
        error ===
        "Сервер не работает. Проверьте подключение и попробуйте еще раз"
      ) {
        console.error(error);
        return;
      }
      if (error === "Мало букв") {
        console.error(error);
        return;
      }
      // Если не сработал ни один случай выше, то осталась ошибка сервера
      alert("Кажется, у вас сломался интернет, попробуйте позже");
      return;
    });
}

function timeComment() {
  let myTime = 0;
  let myDate = new Date();
  let day = myDate.getDate();
  let month = myDate.getMonth();
  let year = myDate.getFullYear();
  let hour = myDate.getHours();
  let minute = myDate.getMinutes();

  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }

  myTime = day + "." + month + "." + year + " " + hour + ":" + minute;
  return myTime;
}

