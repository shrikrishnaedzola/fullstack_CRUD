// const API_URL = "https://fullstackcrud-backend.vercel.app/items";
const API_URL = "http://127.0.0.1:8000/items";

async function loadItems() {
    const list = document.getElementById("itemList");
    
    // Only show loading if list is empty
    if (!list.hasChildNodes() || list.querySelector(".empty-state") || list.querySelector(".loading-state")) {
        list.innerHTML = `<li class="loading-state"><span class="spinner"></span>Loading items...</li>`;
    }

    try {
        const response = await fetch(API_URL);
        const items = await response.json();

        list.innerHTML = "";

        const activeItems = items.filter(item => item.active == 1);

        if (activeItems.length === 0) {
            list.innerHTML = `<li class="empty-state">No items yet. Add one above!</li>`;
            return;
        }

        for (const item of activeItems) {
            const li = document.createElement("li");

            const nameSpan = document.createElement("span");
            nameSpan.textContent = item.name;

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.className = "edit-btn";
            editButton.addEventListener("click", () => editItem(item.id, item.name, editButton));

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-btn";
            deleteButton.addEventListener("click", () => deleteItem(item.id, deleteButton));

            li.appendChild(nameSpan);
            li.appendChild(editButton);
            li.appendChild(deleteButton);
            list.appendChild(li);
        }
    } catch (error) {
        console.error("Error loading items:", error);
        list.innerHTML = `<li class="empty-state">Failed to load items. Check server connection.</li>`;
    }
}

async function addItem() {
    const input = document.getElementById("itemInput");
    const addButton = document.getElementById("addButton");
    const name = input.value.trim();

    if (name === "") {
        return;
    }

    // Set loading state
    addButton.disabled = true;
    addButton.innerHTML = `<span class="spinner"></span>Adding...`;
    input.disabled = true;

    try {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name })
        });

        input.value = "";
        await loadItems();
    } catch (error) {
        console.error("Failed to add item:", error);
        alert("Failed to add item. Please try again.");
    } finally {
        addButton.disabled = false;
        addButton.textContent = "Add";
        input.disabled = false;
        input.focus();
    }
}

async function editItem(id, currentName, buttonElement) {
    const newName = prompt("Edit item:", currentName);

    if (newName === null || newName.trim() === "" || newName.trim() === currentName) {
        return;
    }

    // Set loading state on the clicked button
    const originalText = buttonElement.textContent;
    buttonElement.disabled = true;
    buttonElement.innerHTML = `<span class="spinner"></span>Saving...`;

    try {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName.trim() })
        });

        await loadItems();
    } catch (error) {
        console.error("Failed to update item:", error);
        alert("Failed to update item.");
        buttonElement.disabled = false;
        buttonElement.textContent = originalText;
    }
}

async function deleteItem(id, buttonElement) {
    const confirmed = confirm("Are you sure you want to delete this item?");

    if (!confirmed) {
        return;
    }

    // Set loading state on the clicked button
    const originalText = buttonElement.textContent;
    buttonElement.disabled = true;
    buttonElement.innerHTML = `<span class="spinner"></span>Deleting...`;

    try {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        await loadItems();
    } catch (error) {
        console.error("Failed to delete item:", error);
        alert("Failed to delete item.");
        buttonElement.disabled = false;
        buttonElement.textContent = originalText;
    }
}

document.getElementById("addButton").addEventListener("click", addItem);
document.getElementById("itemInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addItem();
    }
});

loadItems();