const elForm = document.querySelector(".register-form");
const elUsernameInput = elForm.querySelector(".username");
const elEmailInput = elForm.querySelector(".email");
const elPhoneInput = elForm.querySelector(".phone");
const elPasswordInput = elForm.querySelector(".password");


async function registerUsers(){
    try {
        const res = await fetch("http://localhost:5000/user/register", {
            method: "post",

            headers:{
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                user_name: elUsernameInput.value,
                phone: elPhoneInput.value,
                email: elEmailInput.value,
                password: elPasswordInput.value
            })
        })
        const data = await res.json();
        if(data.token){
            window.location.pathname = "/index.html"
        }

    } catch (err){
        console.log(err)
    }
};

elForm.addEventListener("submit",(evt) => {
    evt.preventDefault();
    registerUsers()
});

