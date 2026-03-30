const cardContainer = document.getElementById('cardContainer');
const addBtn = document.getElementById('addBtn');

function renderCards() {
    const data = Storage.fetch();
    cardContainer.innerHTML = '';

    data.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        
        const tasksHTML = item.tasks.map((t, taskIndex) => `
            <li class="task-item">
                <label><input type="checkbox"> <span>${t}</span></label>
                <span class="del-task" onclick="event.stopPropagation(); deleteTask(${index}, ${taskIndex})">×</span>
            </li>
        `).join('');

        card.innerHTML = `
            <div class="card-header" onclick="this.parentElement.classList.toggle('active')">
                <h3>${item.name}</h3>
                <span class="edit-icon" onclick="event.stopPropagation(); editSubject(${index})">✎</span>
            </div>
            <div class="task-section">
                <a href="${item.link}" target="_blank" class="resource-link">Open Link ↗</a>
                <ul class="checklist">${tasksHTML}</ul>
                <div class="add-task-inline">
                    <input type="text" id="newInp-${index}" placeholder="Quick add..." onkeypress="if(event.key === 'Enter') addTaskToExisting(${index})">
                    <button onclick="addTaskToExisting(${index})">+</button>
                </div>
                <button onclick="deleteWholeSubject(${index})" class="btn-delete-all">Delete Entire Subject</button>
            </div>
        `;
        cardContainer.appendChild(card);
    });
}

function deleteTask(sIdx, tIdx) {
    const data = Storage.fetch();
    data[sIdx].tasks.splice(tIdx, 1);
    Storage.save(data);
    renderCards();
    document.querySelectorAll('.card')[sIdx].classList.add('active');
}

function editSubject(index) {
    const data = Storage.fetch();
    const newName = prompt("Edit Subject Name:", data[index].name);
    const newLink = prompt("Edit Link:", data[index].link);
    if (newName && newLink) {
        data[index].name = newName;
        data[index].link = newLink;
        Storage.save(data);
        renderCards();
    }
}

function addTaskToExisting(index) {
    const input = document.getElementById(`newInp-${index}`);
    if (input.value.trim()) {
        const data = Storage.fetch();
        data[index].tasks.push(input.value.trim());
        Storage.save(data);
        renderCards();
        document.querySelectorAll('.card')[index].classList.add('active');
    }
}

addBtn.addEventListener('click', () => {
    const name = document.getElementById('topicName').value;
    const link = document.getElementById('topicLink').value;
    const taskInput = document.getElementById('taskInput').value;

    if (name && link) {
        const tasks = taskInput ? taskInput.split(/[,\n\r;]+/).map(t => t.trim()).filter(t => t !== "") : [];
        const data = Storage.fetch();
        data.push({ name, link, tasks });
        Storage.save(data);
        renderCards();
        document.getElementById('topicName').value = '';
        document.getElementById('topicLink').value = '';
        document.getElementById('taskInput').value = '';
    }
});

function deleteWholeSubject(index) {
    if(confirm("Delete everything in this topic?")) {
        const data = Storage.fetch();
        data.splice(index, 1);
        Storage.save(data);
        renderCards();
    }
}

renderCards();