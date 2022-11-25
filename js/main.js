const loginToken = localStorage.getItem("login-token");

if(!loginToken){
    window.location.pathname = "/login.html"
}

// get todo form and list
const elTodoForm = document.querySelector(".task-form");
const elTodoInput = document.querySelector(".task-input");
const elTodoList = document.querySelector(".task-collection");

// get alert text
const elAlertText = document.querySelector(".alert");

// Modal
const elEditModal = document.querySelector(".modal-wrap");
const elEditForm = document.querySelector(".modal-form");
let elEditInput = document.querySelector(".modal-input");
let elEditCloseBtn = document.querySelector(".modal-close-btn");

const elOverlay = document.querySelector(".overlay")

// get template
const elTaskTemplate = document.querySelector(".todo-template").content;

// global fragment
const globalFragment = new DocumentFragment();

// Render todo
function renderTodo(arr, node){
    node.innerHTML = "";
    arr.forEach(item => {
        const templateClone = elTaskTemplate.cloneNode(true);

        if(item.completed){
            templateClone.querySelector(".input-checkbox").checked = true;
            templateClone.querySelector(".task").style.opacity = "0.5";
        }
        templateClone.querySelector(".task-text").textContent = item.todo_value;
        templateClone.querySelector(".task-text").dataset.id = item.id;
        templateClone.querySelector(".edit-btn").dataset.id = item.id;
        templateClone.querySelector(".delete-btn").dataset.id = item.id;
        templateClone.querySelector(".input-checkbox").dataset.id = item.id;

        globalFragment.appendChild(templateClone)
    });
    node.appendChild(globalFragment);
}

// create todo
async function createTodo(){
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

// Get all todos
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

// Send todo
elTodoForm.addEventListener("submit", evt => {
    evt.preventDefault();
    createTodo();
    getTodo();
});


// Edit task
async function editTask(id, values){
    try {
        const res = await fetch(`http://localhost:5000/todo/${id}`, {
            method: "put",
            headers: {
                Authorization : loginToken,
                "Content-Type": "application/json"
            },
        
            body: JSON.stringify({
                text: values,
            })
        });
        const data = await res.json();
        elAlertText.textContent = data;
        elAlertText.classList.add("show", "alert-green")
        setTimeout(() => {
            elAlertText.classList.remove("show", "alert-green")
        }, 2000)
        getTodo();
    } catch (error) {
        console.log(error);
    }
}

// Checked task
async function checkedTask(id){
    try {
        const res = await fetch(`http://localhost:5000/todo/edit/${id}`, {
            method: "put",
            headers: {
                Authorization : loginToken,
                "Content-Type": "application/json"
            }
        });
        getTodo();
    } catch (error) {
        console.log(error);
    }
}

// Delete task
async function deleteTask(id){
    try {
        const res = await fetch(`http://localhost:5000/todo/${id}`, {
            method: "delete",
            headers: {
                Authorization : loginToken,
                "Content-Type": "application/json"
            }
        });
        const data = await res.json();
        elAlertText.textContent = data;
        elAlertText.classList.add("show", "alert-red")
        setTimeout(() => {
            elAlertText.classList.remove("show", "alert-red")
        }, 2000)
        getTodo();
    } catch (error) {
        console.log(error);
    }
}

// Todo event delegation
let editBtnId = "";
elTodoList.addEventListener("click", evt => {
    if(evt.target.matches(".edit-btn")){
        editBtnId = evt.target.dataset.id;
        elEditModal.classList.add("show");
        elOverlay.classList.add("show");
    }
    if(evt.target.matches(".delete-btn")){
        const deleteBtnId = evt.target.dataset.id;
        deleteTask(deleteBtnId);
    }
    if(evt.target.matches(".input-checkbox")){
        const checkboxId = evt.target.dataset.id;
        checkedTask(checkboxId)
    }
});

// Edit form
elEditForm.addEventListener("submit", evt => {
    evt.preventDefault();
    elEditModal.classList.remove("show");
    elOverlay.classList.remove("show");
    const inpuvalue = elEditInput.value
    editTask(editBtnId, inpuvalue);
    elEditForm.reset()
});

// Edit form close btn
elEditCloseBtn.addEventListener("click", () => {
    elEditModal.classList.remove("show");
    elOverlay.classList.remove("show");
});





