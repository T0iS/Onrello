var colNum = localStorage.length;

function createColumnDialog() {
  document.getElementById('colDialog').show();
}

var hideDialog = function (id) {
  document.getElementById(id).hide();
};

function createColumn() {
  localStorage.setItem(
    'column' + colNum,
    JSON.stringify({ name: $('#colName').val(), num: colNum++, data: {} })
  );

  showData();
}

function showData() {
  $('#colData').empty();
  for (var i = 0; i < localStorage.length; i++) {
    var newCol = document.createElement('ons-list');
    var k = localStorage.key(i);

    obj = JSON.parse(localStorage.getItem(k));
    var cName = document.createElement('p');
    newCol.setAttribute('id', 'column' + obj.num);
    cName.innerHTML = obj.name;

    newCol.innerHTML =
      '<div class="addStuff" onclick="addTaskDialog(' +
      obj.num +
      ')">+ Add task...</div>';
    var container = document.createElement('div');
    container.setAttribute('class', 'column');
    container.setAttribute('id', 'contCol' + obj.num);

    document.getElementById('colData').appendChild(container);
    document.getElementById('contCol' + obj.num).appendChild(cName);
    document.getElementById('contCol' + obj.num).appendChild(newCol);

    for (var element in obj.data) {
      var newTask = document.createElement('ons-list-item');
      try {
        newTask.innerHTML = obj.data[element].taskName;
        console.log(obj.data[element].taskName);
      } catch (err) {
        console.log(err.message);
        continue;
      }
      var test = document.createElement('div');
      test.setAttribute('class', 'itemPic');
      test.setAttribute('onclick', 'editDialog(' + i + ',' + element + ')');
      test.innerHTML = '<img src="edit.png" style="width:30px;length:40px;">';

      newTask.appendChild(test);

      test = document.createElement('div');
      test.setAttribute('class', 'itemPic');
      test.setAttribute('onclick', 'delItem(' + i + ',' + element + ')');
      test.innerHTML = '<img src="delete.png" style="width:20px;length:25px;">';
      newTask.appendChild(test);

      document.getElementById('column' + obj.num).appendChild(newTask);
    }
  }
}

function removeAll() {
  ons.notification.alert('Removed All Items');
  $('#todoList').empty();
  localStorage.clear();
  colNum = localStorage.length;
  showData();
}

document.addEventListener('init', function (event) {
  showData();
});

function addTask(idCol, num) {
  var taskName = $('#taskName').val();
  var dateD = $('#taskDate').val();
  var textArea = $('#taskText').val();
  var notif = document.getElementById('notifON').checked;

  existing = localStorage.getItem(localStorage.key(idCol));

  existing = JSON.parse(existing);

  console.log(existing['data']);
  if (Object.keys(existing.data).length == 0) {
    existing['data'] = {
      [num]: {
        taskName: taskName,
        due: dateD,
        text: textArea,
        notifications: notif,
      },
    };
  } else {
    newD = {
      [num]: {
        taskName: taskName,
        due: dateD,
        text: textArea,
        notifications: notif,
      },
    };

    existing['data'] = Object.assign({}, existing['data'], newD);
  }

  console.log(Object.keys(existing.data).length);
  localStorage.setItem('column' + idCol, JSON.stringify(existing));

  showData();
}

function addTaskDialog(idCol) {
  var num = $('#column' + idCol + ' > ons-list-item').length;
  document.getElementById('taskDialog').show();
  var btn = document.getElementById('push-button4');
  btn.setAttribute('onclick', 'addTask(' + idCol + ',' + num + ')');
}

function delItem(i, j) {
  var k = localStorage.key(i);

  obj = JSON.parse(localStorage.getItem(k));

  delete obj.data[j];
  localStorage.setItem(localStorage.key(i), JSON.stringify(obj));
  showData();
}

function editDialog(i, j) {}
