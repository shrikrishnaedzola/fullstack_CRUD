const API_URL = "https://fullstackcrud-frontend.vercel.app/items";

async function loadItems() {
    const response = await fetch(API_URL);
    const items = await response.json();

    const list = document.getElementById("itemList");
    list.innerHTML = "";

    for (const item of items) {
    const li = document.createElement("li");

    const nameSpan = document.createElement("span");
    nameSpan.textContent = item.name;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-btn";
    editButton.addEventListener("click", () => editItem(item.id, item.name));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";
    deleteButton.addEventListener("click", () => deleteItem(item.id));

    li.appendChild(nameSpan);
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    list.appendChild(li);
}
}

async function addItem() {
    const input = document.getElementById("itemInput");
    const name = input.value.trim();

    if (name === "") {
        return;
    }

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name })
    });

    input.value = "";
    loadItems();
}

async function editItem(id, currentName) {
    const newName = prompt("Edit item:", currentName);

    if (newName === null || newName.trim() === "") {
        return;
    }

    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() })
    });

    loadItems();
}

async function deleteItem(id) {
    const confirmed = confirm("Are you sure you want to delete this item?");

    if (!confirmed) {
        return;
    }

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    loadItems();
}
document.getElementById("addButton").addEventListener("click", addItem);

loadItems();