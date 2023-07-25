import { v4 as uuidv4 } from 'uuid'


const list = document.querySelector<HTMLUListElement>('.list');
const form = document.getElementById('new-task-form') as HTMLFormElement | null
const input = document.querySelector<HTMLInputElement>('#new-task-title');
const menuItems: NodeListOf<HTMLAnchorElement> = document.querySelectorAll ('nav ul li a');
const titleState = document.getElementById('title-state') as HTMLTitleElement | null;

let noEmpty = document.getElementsByClassName('empty')[0] as HTMLDivElement | null;
let doneCounter = document.getElementById('done-counter') as HTMLSpanElement | null;
let taskCounter = document.getElementById('task-counter') as HTMLSpanElement | null;
let day:string = "today";
let tasks:Task[] = loadTasks(day);


tasks.forEach(addListItem)
updateDoneCounter(day);
if (titleState) titleState.textContent = day;


type Task = {
    id: string,
    title: string,
    completed: boolean,
    createdAt: Date,
    when: string
}

function toggleSelectedClass(this: HTMLAnchorElement): void {
    menuItems.forEach(item => {
        item.classList.remove('selected');
    });
        day = this.textContent?.trim() || "today";
        if (titleState) titleState.textContent = day;

    this.classList.add('selected');
    tasks = loadTasks(day);

    if (list) {
        list.innerHTML = ""
        tasks.forEach(addListItem);
    } else {
        console.log("no list available")
    }
    updateDoneCounter(day);
}

menuItems.forEach(item => {
    item.addEventListener('click', toggleSelectedClass);
});

form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if(input?.value =="" ||input?.value == null) return


    const task: Task = {
        id: uuidv4(),
        title: input.value,
        completed: false,
        createdAt: new Date(),
        when: day
    }
    tasks.push(task);
    addListItem(task);
    input.value = ""
    saveTasks(day)
    updateDoneCounter(day)
})
function addListItem(task:Task) {
    const item = document.createElement("li");
    const label = document.createElement("label");
    const span = document.createElement("span");
    const labelCheckbox = document.createElement("label");
    const checkbox = document.createElement("input");
    const btn = document.createElement("span");
    span.textContent = task.title;
    btn.className = "trash-icon";
    btn.id = "delete";
    btn.addEventListener("click", () => {
        deleteTask(task.id);
        item.remove();
    });
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked
        saveTasks(day)
        updateDoneCounter(day)
        task.completed ? item.classList.add("completed") : item.classList.remove("completed")
    })
    task.completed ? item.classList.add("completed") : item.classList.remove("completed")
    label.append(checkbox);
    label.append(labelCheckbox);
    label.append(span);
    item.append(btn);
    item.append(label);
    list?.append(item);
}
function saveTasks(day:string) {
    localStorage.setItem(day, JSON.stringify(tasks))
}
function loadTasks(day: string): Task[] {
    const taskJSON = localStorage.getItem(day);
    if (!taskJSON) return [];

    const tasks = JSON.parse(taskJSON);
    updateDoneCounter(day);

    return tasks;
}
function updateDoneCounter(day:string) {
    const taskJSON = localStorage.getItem(day);
    const tasks = taskJSON ? JSON.parse(taskJSON) : [];
    const checked= tasks.filter((item: { completed: boolean; }) => item.completed);
    if(doneCounter) {
        doneCounter.textContent = checked.length;
    }
    if(taskCounter) {
        taskCounter.textContent = tasks.length;
        if (tasks.length === 0) {
            noEmpty?.classList.remove("no-empty");
        } else if (noEmpty) {
            noEmpty?.classList.add("no-empty");
        }
    }
}
function deleteTask(id: string) {
    tasks = tasks.filter(item => item.id !== id);
    saveTasks(day);
    updateDoneCounter(day);
}