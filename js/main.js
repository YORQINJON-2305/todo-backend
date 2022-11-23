const loginToken = localStorage.getItem("login-token");

if(!loginToken){
    window.location.pathname = "/login.html"
}

const elTodoForm = document.querySelector(".task-form");
const elTodoInput = document.querySelector(".task-input");
const elTodoList = document.querySelector(".task-collection");

const elAlertText = document.querySelector(".alert");

// get template
const elTaskTemplate = document.querySelector(".todo-template").content;

// global fragment
const globalFragment = new DocumentFragment();


function renderTodo(arr, node){
    node.innerHTML = "";
    arr.forEach(item => {
        const templateClone = elTaskTemplate.cloneNode(true);

        templateClone.querySelector(".task-text").textContent = item.todo_value;
        templateClone.querySelector(".edit-btn").dataset.id = item.id;
        templateClone.querySelector(".delete-btn").dataset.id = item.id;

        globalFragment.appendChild(templateClone)
    });
    node.appendChild(globalFragment);
}

async function taskUser(){
    try {
        const res = await fetch("http://localhost:5000/todo", {
            method: "post",
            headers: {
                Authorization : loginToken,
                "Content-Type": "application/json"
            },
        
            body: JSON.stringify({
                text: elTodoInput.value
            })
        });
    } catch (error) {
        console.log(error);
    }
}

async function getTodo(){
    try {
        const res = await fetch("http://localhost:5000/todo", {
            headers: {
                Authorization : loginToken,
                "Content-Type": "application/json"
            }
        
        });

        const data = await res.json();
        renderTodo(data, elTodoList);
    } catch (error) {
        console.log(error);
    }
}


getTodo()

elTodoForm.addEventListener("submit", evt => {
    evt.preventDefault();
    taskUser();
    getTodo();
});


async function editTask(id){
    const newText = prompt("Edit task!");
    try {
        const res = await fetch(`http://localhost:5000/todo/${id}`, {
            method: "put",
            headers: {
                Authorization : loginToken,
                "Content-Type": "application/json"
            },
        
            body: JSON.stringify({
                text: newText
            })
        });
        const data = await res.json();
        elAlertText.textContent = data;
        elAlertText.classList.add("show")
        setTimeout(() => {
            elAlertText.classList.remove("show")
        }, 2000)
        getTodo();
    } catch (error) {
        console.log(error);
    }
}

async function deleteTask(id){
    try {
        const res = await fetch(`http://localhost:5000/todo/${id}`, {
            method: "delete",
            headers: {
                Authorization : loginToken,
                "Content-Type": "application/json"
            }
        });
        getTodo()
    } catch (error) {
        console.log(error);
    }
}

elTodoList.addEventListener("click", evt => {
    if(evt.target.matches(".edit-btn")){
        const editBtnId = evt.target.dataset.id;
        editTask(editBtnId);
    }
    if(evt.target.matches(".delete-btn")){
        const deleteBtnId = evt.target.dataset.id;
        deleteTask(deleteBtnId);
    }
});


