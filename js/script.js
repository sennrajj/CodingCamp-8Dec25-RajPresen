let todos = JSON.parse(localStorage.getItem("todos")) || [];
let deletedCount = Number(localStorage.getItem("deleted")) || 0;
let selectedId = null;
let deleteId = null;

const tableBody = document.querySelector("tbody");
const cards = document.querySelectorAll(".card");

// Function Save Todos
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("deleted", deletedCount);
}

// Show Alerts
function showAlert(message, color = "bg-blue-600") {
    const alert = document.getElementById("alert");

    alert.innerText = message;
    alert.className =
        `fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 
         text-white font-semibold rounded-lg shadow-lg z-50
         transition duration-300 opacity-0 ${color}`;

    alert.classList.remove("hidden");

    setTimeout(() => alert.classList.remove("opacity-0"), 10);

    setTimeout(() => {
        alert.classList.add("opacity-0");
        setTimeout(() => alert.classList.add("hidden"), 300);
    }, 1500);
}

// Function Add Todo
function addTodo() {
    const task = document.getElementById("todo-input").value.trim();
    const date = document.getElementById("todo-date").value.trim();

    if (!task || !date) {
        openWarningModal();
        return;
    }

    const newTodo = {
        id: Date.now(),
        task,
        date,
        status: "Pending"
    };

    todos.push(newTodo);

    saveTodos();
    renderTodos();
    updateStats();

    showAlert("Task added!", "bg-blue-600");

    document.getElementById("todo-input").value = "";
    document.getElementById("todo-date").value = "";
}

// Function Render Table
function renderTodos(list = todos) {
    tableBody.innerHTML = "";

    list.forEach(todo => {
        const tr = document.createElement("tr");
        tr.classList.add("animate-fade");

        tr.innerHTML = `
            <td class="p-2">${todo.task}</td>
            <td class="p-2">${todo.date}</td>
            <td class="p-2 font-semibold ${todo.status === "Completed" ? "text-green-600" : "text-yellow-600"}">
                ${todo.status}
            </td>
            <td class="p-2 space-x-2">
                <button type="button" onclick="openEditModal(${todo.id})"
                    class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Edit</button>
                
                <button onclick="completeTodo(${todo.id})"
                    class="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700">✓</button>
                
                <button type="button" onclick="openDeleteModal(${todo.id})"
                    class="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
            </td>
        `;

        tableBody.appendChild(tr);
    });
}

// Function Action Complete Todo
function completeTodo(id) {
    todos = todos.map(t => t.id === id ? { ...t, status: "Completed" } : t);

    saveTodos();
    renderTodos();
    updateStats();

    showAlert("Task completed!", "bg-green-600");
}

// Funcion Edit Modals
function openEditModal(id) {
    selectedId = id;
    const todo = todos.find(t => t.id === id);

    document.getElementById("edit-task-input").value = todo.task;
    document.getElementById("edit-modal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("edit-modal").classList.add("hidden");
}

function saveEdit() {
    const newTask = document.getElementById("edit-task-input").value.trim();

    if (!newTask) {
        showAlert("Task cannot be empty!", "bg-yellow-500");
        return;
    }

    todos = todos.map(t =>
        t.id === selectedId ? { ...t, task: newTask } : t
    );

    saveTodos();
    renderTodos();
    updateStats();
    closeModal();

    showAlert("Task updated!", "bg-blue-600");
}

// Function Delete One Modals
function openDeleteModal(id) {
    deleteId = id;
    document.getElementById("delete-modal").classList.remove("hidden");
}

function closeDeleteModal() {
    document.getElementById("delete-modal").classList.add("hidden");
}

function confirmDelete() {
    todos = todos.filter(t => t.id !== deleteId);

    deletedCount++;
    saveTodos();
    renderTodos();
    updateStats();

    closeDeleteModal();
    showAlert("Task deleted!", "bg-red-600");
}

// Function Delete All Modals
function openDeleteAllModal() {
    document.getElementById("delete-all-modal").classList.remove("hidden");
}

function closeDeleteAllModal() {
    document.getElementById("delete-all-modal").classList.add("hidden");
}

function confirmDeleteAll() {
    deletedCount += todos.length;
    todos = [];

    saveTodos();
    renderTodos();
    updateStats();

    closeDeleteAllModal();
    showAlert("All tasks deleted!", "bg-red-600");
}

// Function Filter by Date
function filterByDate() {
    const date = document.getElementById("todo-date").value;

    if (!date) {
        showAlert("Select a date first!", "bg-yellow-500");
        return;
    }

    const filtered = todos.filter(t => t.date === date);

    renderTodos(filtered);
    showAlert("Filtered!", "bg-blue-600");
}

// Function Warning Field Modals
function openWarningModal() {
    document.getElementById("warning-modal").classList.remove("hidden");
}

function closeWarningModal() {
    document.getElementById("warning-modal").classList.add("hidden");
}

// Function Update Status
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.status === "Completed").length;
    const pending = todos.filter(t => t.status === "Pending").length;

    cards[0].innerText = "Total: " + total;
    cards[1].innerText = "Completed: " + completed;
    cards[2].innerText = "Pending: " + pending;
    cards[3].innerText = "Deleted: " + deletedCount;
}

// Init
renderTodos();
updateStats();