const folderStructure = {
    name: "Root",
    type: "folder",
    children: [
        {
            name: "Folder 1",
            type: "folder",
            children: [
                { name: "File 1.txt", type: "file" },
                { name: "File 2.txt", type: "file" }
            ]
        },
        {
            name: "Folder 2",
            type: "folder",
            children: [
                { name: "File 3.txt", type: "file" }
            ]
        }
    ]
};

function createTreeNode(item) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.className = item.type === 'folder' ? "caret" : "";
    span.textContent = item.name;
    li.appendChild(span);

    if (item.type === 'folder' && item.children) {
        const nestedUl = document.createElement('ul');
        nestedUl.className = "nested";
        item.children.forEach(child => {
            nestedUl.appendChild(createTreeNode(child));
        });
        li.appendChild(nestedUl);
    }

    return li;
}

const myTree = document.getElementById('myTree');
const rootNode = createTreeNode(folderStructure);
myTree.appendChild(rootNode);

// Populate folder select options
const folderSelect = document.getElementById('folderSelect');
populateFolderSelect(folderStructure, folderSelect);

function populateFolderSelect(folder, select) {
    if (folder.type === 'folder') {
        const option = document.createElement('option');
        option.value = folder.name;
        option.textContent = folder.name;
        select.appendChild(option);
        if (folder.children) {
            folder.children.forEach(child => {
                populateFolderSelect(child, select);
            });
        }
    }
}

// Function to toggle visibility of nested content
function toggleContent(e) {
    const clickedElement = e.target;
    clickedElement.classList.toggle("active");
    const content = clickedElement.nextElementSibling;
    content.style.display = content.style.display === "block" ? "none" : "block";

    // Close siblings' nested content
    const siblings = clickedElement.parentElement.parentElement.children;
    for (let sibling of siblings) {
        if (sibling !== clickedElement.parentElement) {
            const siblingContent = sibling.querySelector(".nested");
            if (siblingContent) {
                siblingContent.style.display = "none";
                sibling.querySelector(".caret").classList.remove("active");
            }
        }
    }
}

const caretElements = document.getElementsByClassName("caret");
for (let i = 0; i < caretElements.length; i++) {
    caretElements[i].addEventListener('click', toggleContent);
}

function addFolder(parentNode, folderName) {
    const folder = {
        name: folderName,
        type: "folder",
        children: []
    };

    const folderNode = createTreeNode(folder);
    parentNode.appendChild(folderNode);

    const caretElement = folderNode.querySelector(".caret");
    if (caretElement) {
        caretElement.addEventListener('click', toggleContent);
    }
}

const addFolderButton = document.getElementById('addFolderButton');
addFolderButton.addEventListener('click', function () {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
        const folderSelect = document.querySelector(".active");
        if (folderSelect) {
            addFolder(folderSelect.nextElementSibling, folderName);
        } else {
            addFolder(myTree, folderName);
        }
    }
});

function addFile(fileName, parentNode) {
    const file = {
        name: fileName,
        type: "file"
    };

    const fileNode = createTreeNode(file);
    parentNode.appendChild(fileNode);
}

const addFileButton = document.getElementById('addFileButton');
addFileButton.addEventListener('click', function () {
    const fileName = prompt("Enter file name:");
    if (fileName) {
        const folderSelect = document.querySelector(".active");
        if (folderSelect) {
            const nestedUl = folderSelect.nextElementSibling.querySelector('.nested');
            if (nestedUl) {
                addFile(fileName, nestedUl);
            } else {
                alert("Selected folder has no subfolders.");
            }
        } else {
            alert("Please select a folder.");
        }
    }
});

function deleteSelected() {
    const selectedItem = document.querySelector(".active");
    if (selectedItem) {
        const parentElement = selectedItem.parentElement;
        parentElement.removeChild(selectedItem);
    } else {
        alert("Please select an item to delete.");
    }
}

const deleteButton = document.getElementById('deleteButton');
deleteButton.addEventListener('click', deleteSelected);
