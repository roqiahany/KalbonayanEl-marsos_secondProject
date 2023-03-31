'use strict';
document.addEventListener('DOMContentLoaded', function () {
  const addBtn = [];
  const tasks = [];
  let task = document.querySelectorAll('.task');
  for (let i = 0; i < 3; i++) {
    addBtn[i] = document.querySelector(`.add-${i + 1}`);
    tasks[i] = document.querySelector(`.tasks-${i + 1}`);
  }

  let id = 1;
  let array = [[], [], []];

  let dragStartNode;
  let dragStartIndex;
  let startColumnIndex;

  let input1 = document.querySelectorAll('.input-1');
  let input2 = document.querySelectorAll('.input-2');
  let input3 = document.querySelectorAll('.input-3');
  let delBtn = document.querySelectorAll('.delete');

  if (localStorage.getItem('tasks')) {
    const data = JSON.parse(window.localStorage.getItem('tasks'));

    for (let i = 0; i < 3; i++) {
      array[i] = data[i].filter((val) => val != '');
    }
    getData();
  }

  for (let d of delBtn) {
    d.addEventListener('click', del);
  }

  for (let i = 0; i < 3; i++)
    addBtn[i].addEventListener('click', function () {
      let html = `<div class="task" draggable="true" id="t${id}">
      <input type="text" placeholder="e.g. New Progress" class="input-${
        i + 1
      }" id="i${id}"/>
      
      <button class="delete">
      <ion-icon name="trash-outline" class="icon"></ion-icon>
      </button>
      
      </div>`;
      id++;
      tasks[i].insertAdjacentHTML('beforeend', html);
      input1 = document.querySelectorAll('.input-1');
      input2 = document.querySelectorAll('.input-2');
      input3 = document.querySelectorAll('.input-3');
      delBtn = document.querySelectorAll('.delete');
      task = document.querySelectorAll('.task');

      const newInputFields = document.querySelector(`#i${id - 1}`);

      array[i].push('');

      newInputFields.addEventListener('change', add);
      const d = newInputFields.parentElement.querySelector('.delete');
      d.addEventListener('click', del);
      dragTasks(task);
    });

  for (let input of [...input1, ...input2, ...input3]) {
    input.addEventListener('change', add);
  }

  function add(e) {
    const val = e.target.value;

    if (this.parentNode.parentNode.classList.value[6] == 1) {
      array[0][
        Array.from(this.parentElement.parentElement.children).indexOf(
          this.parentElement
        )
      ] = val;
    } else if (this.parentNode.parentNode.classList.value[6] == 2) {
      array[1][
        Array.from(this.parentElement.parentElement.children).indexOf(
          this.parentElement
        )
      ] = val;
    } else {
      array[2][
        Array.from(this.parentElement.parentElement.children).indexOf(
          this.parentElement
        )
      ] = val;
    }

    addDataToLocal(array);
  }
  dragTasks(task);

  function dragTasks(task) {
    task.forEach((item) => {
      item.addEventListener('dragstart', dragStart);
      item.addEventListener('dragleave', dragLeave);
      item.addEventListener('dragover', dragover);
      item.addEventListener('dragenter', dragEnter);
      item.addEventListener('drop', dragDrop);
    });
    tasks.forEach((item) => {
      item.addEventListener('drop', dragDropEmpty);
      item.addEventListener('dragover', dragover);
    });
  }

  function dragStart() {
    dragStartNode = this;
    dragStartIndex = Array.from(this.parentElement.children).indexOf(this);
    startColumnIndex = this.parentNode.classList.value[6] - 1;
  }
  function dragLeave() {
    this.classList.remove('over');
  }
  function dragEnter() {
    this.classList.add('over');
  }
  function dragover(e) {
    e.preventDefault();
  }
  function dragDrop() {
    const temp = array[startColumnIndex][dragStartIndex];
    const dragEndIndex = Array.from(this.parentElement.children).indexOf(this);

    // const tasksParent = this.parentNode;

    this.classList.remove('over');
    if (startColumnIndex != this.parentNode.classList.value[6] - 1) {
      array[this.parentNode.classList.value[6] - 1].splice(
        dragEndIndex + 1,
        0,
        temp
      );
      array[startColumnIndex].splice(dragStartIndex, 1);
    } else {
      array[this.parentNode.classList.value[6] - 1].splice(
        dragEndIndex + 1,
        0,
        temp
      );
      if (dragEndIndex < dragStartIndex)
        array[this.parentNode.classList.value[6] - 1].splice(
          dragStartIndex + 1,
          1
        );
      else {
        array[this.parentNode.classList.value[6] - 1].splice(dragStartIndex, 1);
      }
    }

    this.parentNode.insertBefore(dragStartNode, this.nextSibling);
    addDataToLocal(array);
  }

  function dragDropEmpty() {
    if (!this.firstElementChild) {
      this.append(dragStartNode);

      const [temp] = array[startColumnIndex].splice(dragStartIndex, 1);
      array[this.classList.value[6] - 1].push(temp);
    }
    addDataToLocal(array);
  }

  function addDataToLocal(arrayOfTasks) {
    window.localStorage.setItem('tasks', JSON.stringify(arrayOfTasks));
  }

  function getData() {
    let data = window.localStorage.getItem('tasks');
    if (data) {
      let tasks = JSON.parse(data);

      render(tasks);
    }
  }

  function render(array) {
    for (let i = 0; i < 3; i++) {
      for (let arr of array[i].filter((arr) => arr != '')) {
        const html = `<div class="task" draggable="true" id="t${id}">
        <input type="text" placeholder="e.g. New Progress" class="input-${
          i + 1
        }" id="i${id}"/>
        
        <button class="delete">
        <ion-icon name="trash-outline" class="class="icon"></ion-icon>
        </button>
        
        </div>`;
        id++;

        tasks[i].insertAdjacentHTML('beforeend', html);
        const el = document.getElementById(`i${id - 1}`);
        el.value = arr;

        input1 = document.querySelectorAll('.input-1');
        input2 = document.querySelectorAll('.input-2');
        input3 = document.querySelectorAll('.input-3');
        delBtn = document.querySelectorAll('.delete');
        task = document.querySelectorAll('.task');
      }
    }
  }

  function del() {
    const deletedIndex = Array.from(
      this.parentElement.parentElement.children
    ).indexOf(this.parentElement);
    const taskColumn = this.parentNode.parentNode.classList.value[6] - 1;
    array[taskColumn].splice(deletedIndex, 1);
    this.parentElement.remove();
    addDataToLocal(array);
  }
});
