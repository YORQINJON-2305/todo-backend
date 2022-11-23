const loginToken = localStorage.getItem("login-token");
if(loginToken){
  window.location.pathname = "/index.html"
}

const elLoginForm = document.querySelector(".login-form");;
const elLoginEmailInput = document.querySelector(".email-login");
const elLoginPasswordInput = document.querySelector(".password-login");


async function loginUser(){

  const obj = {
    email: elLoginEmailInput.value,
    password: elLoginPasswordInput.value
  }

  try {
    const res = await fetch("http://localhost:5000/user/login", {
      method: "post",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(obj)
    });

    const data = await res.json();
    if(data.token){
      localStorage.setItem("login-token", data.token);
      window.location.pathname = "/index.html";
    }

  } catch (error) {
    console.log(error);
  }
}

elLoginForm.addEventListener("submit", evt => {
  evt.preventDefault();

  loginUser()
})