class Task {
    id;
    taskName;
    isCompleted;

    constructor(id, taskName) {
        this.id = id;
        this.taskName = taskName;
        this.isCompleted = false;
    }
}

class TaskList {

    constructor() {
        this.tasksList = [];
    }

    getTasks() {
        return this.tasksList;
    }

    getTaskByID(id) {
        return this.tasksList.find(task => task.id === id);
    }

    getCompletedTasks() {
        return this.tasksList.filter(task => task.isCompleted == true);
    }

    getActiveTasks() {
        return this.tasksList.filter(task => task.isCompleted == false);
    }

    addTask(Task) {
        this.tasksList.push(Task);
    }

    updateTaskName(id, taskName) {
        this.tasksList.forEach((task) => {
            if (task.id === id) {
                task.taskName = taskName;
            }
        });
        return this.tasksList;
    }

    updateTaskState(id, state) {
        this.tasksList.forEach((task) => {
            if (task.id === id) {
                task.isCompleted = state;
            }
        });
    }

    deleteTask(id) {
        this.tasksList.forEach((task, index) => {
            if (task.id === id) {
            this.tasksList.splice(index, 1);
            }
        });
        return this.tasksList;
    }
}

const tasks = new TaskList();
let id = 1;

const yourTaskList = document.querySelector('.task-list > .your-task');
const deleteTaskBtn = document.querySelectorAll('.delete');
const displayItemLeft = document.querySelector('.options > span');

function createHTML(id, taskName, isCompleted) { 
    if (isCompleted) {
        return `
            <div class="task" id="task-${id}">
                <div class="checkbox-wrapper-11">
                    <input id="check-${id}" type="checkbox" name="r" value="checked-${id}" onclick="updateTaskState(${id})" checked>
                    <label for="check-${id}"><span role="text">${taskName}</span></label>
                </div>
                <div class="task-option-${id}">
                    <img src="../icons/edit.svg" alt="edit svg" class="modify" id="edit">
                    <img src="../icons/delete.svg" alt="delete svg" class="modify delete" onclick="deleteTask(${id})">
                </div>
                <div class="edit-option-${id}" hidden>
                    <img src="../icons/check.svg" alt="check svg" class="modify" id="save">
                    <img src="../icons/close.svg" alt="close svg" class="modify" id="close">
                </div>
            </div>
        `;
    } else {
        return `
            <div class="task" id="task-${id}">
                <div class="checkbox-wrapper-11">
                    <input id="check-${id}" type="checkbox" name="r" value="checked-${id}" onclick="updateTaskState(${id})" >
                    <label for="check-${id}"><span role="text">${taskName}</span></label>
                </div>
                <div class="task-option-${id}">
                    <img src="../icons/edit.svg" alt="edit svg" class="modify" id="edit" onclick="editTaskName(${id})">
                    <img src="../icons/delete.svg" alt="delete svg" class="modify delete" onclick="deleteTask(${id})">
                </div>
                <div class="edit-option-${id}" hidden>
                    <img src="../icons/check.svg" alt="check svg" class="modify" id="save" onclick="saveName(${id}, 'save')">
                    <img src="../icons/close.svg" alt="close svg" class="modify" id="close" onclick="saveName(${id}, 'close')">
                </div>
            </div>
        `;
    }
}

// this function is for loading all items
function loadItems(list) {
    list.forEach((task) => {
        const item = createHTML(task.id, task.taskName, task.isCompleted);
        yourTaskList.insertAdjacentHTML('beforeend', item);
    });
}

// this function is for creating new task
function createTask() {
    const taskNameInput = document.getElementById('task-name');
    const taskName = taskNameInput.value;
    let isExisting = false;

    tasks.tasksList.forEach((task) => {
        if (task.taskName === taskName) {
            isExisting = true;
        }
    });
    
    // check if there is inputted string in input
    if (!taskName) {
        alert('Task name is undefined or empty');
        console.error('Task name is undefined or empty');
        return;
    }
    // check if there is already task with the same name
    if (isExisting) {
        alert('Task with the same name already exists');
        return;
    } else {
        tasks.addTask(new Task(id, taskName)); // adding new task in array

        yourTaskList.insertAdjacentHTML('beforeend', createHTML(id, taskName)); // inserting the HTML component to output
        updateDisplayItemLeft(); // update the number of task indicator
        taskNameInput.value = ''; // resetting input task name
        id++; // increment id of task by 1
    }
}

// this function is for deleting task
function deleteTask(id) {
    const item = document.getElementById(`task-${id}`);
    item.remove();
    tasks.deleteTask(id);
    updateDisplayItemLeft();
}

// this function is for deleting all task that are completed
function deleteAllTaskCompleted() {
    const completedTasks = tasks.getCompletedTasks();
    completedTasks.forEach((task) => {
        const item = document.getElementById(`task-${task.id}`);
        deleteTask(task.id);
        item.remove();
    });
}

// this function is for updating the state of task (completed/active) states
function updateTaskState(id) {
    const checkbox = document.querySelector(`#check-${id}`);
    if (checkbox.checked) {
        tasks.updateTaskState(id, true);
    } else {
        tasks.updateTaskState(id, false);
    }
    updateDisplayItemLeft();
}

// this function is for filtering tasks
function filterTask(filterType, component) {
    const spans = document.querySelectorAll('.segments > span');
    spans.forEach((span) => {
        span.classList.remove('active');
    });
    yourTaskList.textContent = '';

    switch(filterType) {
        case 'all':
            component.classList.add('active');
            loadItems(tasks.getTasks());
            break;
            
        case 'active':
            component.classList.add('active');
            loadItems(tasks.getActiveTasks());
            break;

        case 'completed':
            component.classList.add('active');
            loadItems(tasks.getCompletedTasks());
            break;
        
        default:
            break;
    }
}

// this function is for toggle options
function toggleEditOption(taskOption, editOption, isEdited) {
    if (isEdited) {
        taskOption.setAttribute('hidden', 'true');
        editOption.removeAttribute('hidden');
    } else {
        taskOption.removeAttribute('hidden');
        editOption.setAttribute('hidden', 'true');
    }
}

function toggleEditInput(input, span, isEditable) {
    if (isEditable) {
        input.setAttribute('disabled', 'true');
        span.setAttribute('contenteditable', '');
        span.style.borderBottom = 'solid #808080 2px';
    } else {
        input.removeAttribute('disabled');
        span.removeAttribute('contenteditable');
        span.style.borderBottom = 'none';
    }
}

// this function is for editing name of task
function editTaskName(id) {
    const input = document.getElementById(`check-${id}`);
    const span = document.querySelector(`#check-${id} + label > span`);
    const taskOption = document.querySelector(`.task-option-${id}`);
    const editOption = document.querySelector(`.edit-option-${id}`);

    toggleEditOption(taskOption, editOption, true);
    toggleEditInput(input, span, true);

}

function saveName(id, type) {
    const input = document.getElementById(`check-${id}`);
    const span = document.querySelector(`#check-${id} + label > span`);
    const taskOption = document.querySelector(`.task-option-${id}`);
    const editOption = document.querySelector(`.edit-option-${id}`);

    if (type === 'save') {
        const newTaskName = document.querySelector(`#check-${id} + label > span`);
        tasks.updateTaskName(id, newTaskName.textContent);
    } else if (type === 'close') {
        span.textContent = tasks.getTaskByID(id).taskName;
    }

    toggleEditOption(taskOption, editOption, false);
    toggleEditInput(input, span, false);
}

// this function is for updating the number of active task
function updateDisplayItemLeft() {
    displayItemLeft.textContent = `${tasks.getActiveTasks().length} Item/s left`;
}
