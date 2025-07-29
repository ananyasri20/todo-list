window.addEventListener("DOMContentLoaded", () => {
    const ITEMS_CONTAINER = document.getElementById("items");
    const ITEM_TEMPLATE = document.getElementById("itemTemplate");
    const ADD_BUTTON = document.getElementById("add");

    let items = getItems();

    function getItems() {
        const value = localStorage.getItem("todo-test") || "[]";
        return JSON.parse(value);
    }

    function setItems(items) {
        const itemsJson = JSON.stringify(items);
        localStorage.setItem("todo-test", itemsJson);
    }

    function addItem() {
        items.unshift({
            description: "",
            completed: false
        });
        setItems(items);
        refreshList();
    }

    function updateItem(item, key, value) {
        item[key] = value;
        setItems(items);
        refreshList();
    }

    function refreshList() {
        ITEMS_CONTAINER.innerHTML = "";

        for (const item of items) {
            const itemElement = ITEM_TEMPLATE.content.cloneNode(true);
            const descriptionInput = itemElement.querySelector(".item-description");
            const completedInput = itemElement.querySelector(".item-completed");
            const deleteButton = itemElement.querySelector(".delete-button");

            descriptionInput.value = item.description;
            completedInput.checked = item.completed;

            // Apply strike-through if completed
            if (item.completed) {
                descriptionInput.style.textDecoration = "line-through";
            } else {
                descriptionInput.style.textDecoration = "none";
            }

            // Update description (block empty string)
            descriptionInput.addEventListener("change", () => {
                if (descriptionInput.value.trim() === "") {
                    alert("Description cannot be empty.");
                    descriptionInput.value = item.description;
                    return;
                }
                updateItem(item, "description", descriptionInput.value);
            });

            // Update completed status
            completedInput.addEventListener("change", () => {
                updateItem(item, "completed", completedInput.checked);
            });

            // Delete item
            deleteButton.addEventListener("click", () => {
                items = items.filter((i) => i !== item);
                setItems(items);
                refreshList();
            });

            ITEMS_CONTAINER.appendChild(itemElement);
        }
    }

    // Add item on button click
    ADD_BUTTON.addEventListener("click", addItem);

    // Add item on Enter key press
    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && document.activeElement.tagName !== "TEXTAREA") {
            addItem();
        }
    });

    refreshList();
});
