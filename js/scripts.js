var colNum = localStorage.length;

function timedFunction() {
  var d = new Date();
  //console.log(d.toLocaleTimeString());
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;

  var elements = document.getElementsByClassName("taskClass");

  nms = getTaskNames(today);
  for (var i = 0; i < elements.length; i++) {
    var tName = elements[i].children[0].innerText;
    if (nms[0].includes(tName)) {
      elements[i].style.backgroundColor = "#f9fb55";
    }
    if (nms[1].includes(tName)) {
      elements[i].style.backgroundColor = "#ff6666";
    }
    if (nms[2].includes(tName)) {
      elements[i].style.backgroundColor = "#3df953";
    }
  }
}

var intervalID = setInterval(timedFunction, 7777);


function getTaskNames(today) {
  var arrayYellow = [];
  var arrayRed = [];
  var arrayGreen = [];

  storage = localStorage;
  fl_keys = Object.keys(storage);
  for (var i = 0; i < fl_keys.length; i++) {
    obj = JSON.parse(storage[fl_keys[i]]);
    sl_keys = Object.keys(obj.data);
    for (var j = 0; j < sl_keys.length; j++) {
      if (
        obj.data[j].notifications == true &&
        calculateDateDiff(obj.data[j].due, today) < 7
      ) {
        arrayYellow.push(obj.data[j].taskName);
      }
      if (
        obj.data[j].notifications == true &&
        calculateDateDiff(obj.data[j].due, today) < 3
      ) {
        arrayRed.push(obj.data[j].taskName);
      }
      if (obj.data[j].notifications == true && obj.data[j].done == true){
        arrayGreen.push(obj.data[j].taskName);
    }
  }
}
  return [arrayYellow, arrayRed, arrayGreen];
}


function calculateDateDiff(date1, date2) {
  var result = 0;
  var aDay = 86400000;

  result = Math.floor(
    (Date.parse(date1.replace(/-/g, "/")) -
      Date.parse(date2.replace(/-/g, "/"))) /
      aDay
  );
  return result;
}

function createColumnDialog() {
  document.getElementById("colDialog").show();
}

var hideDialog = function (id) {
  document.getElementById(id).hide();
};

function createColumn() {
  localStorage.setItem(
    "column" + colNum,
    JSON.stringify({ name: $("#colName").val(), num: colNum++, data: {} })
  );

  showData();
}

function showData() {
  $("#colData").empty();
  for (var i = 0; i < localStorage.length; i++) {
    var newCol = document.createElement("ons-list");
    //colID = "column" + i;
    var k = localStorage.key(i);
    temp = localStorage.getItem(k);
    obj = JSON.parse(temp);
    var cName = document.createElement("p");
    try {
      newCol.setAttribute("id", "column" + obj.num);
      //cName.setAttribute("onclick","delCol('column" + obj.num+"');");
      var id = "column" + obj.num;
      cName.setAttribute(
        "style",
        "display:flex; flex-drection:row; font-weight:bold; font-size:larger;"
      );
      cName.innerHTML = obj.name;
      var test = document.createElement("div");
      test.setAttribute("class", "itemPic");
      test.setAttribute("onclick", "delCol('column" + obj.num + "');");
      test.innerHTML =
        '<img src="img/delete.png" style="width:20px;length:25px; margin-left:7px;">';
      cName.appendChild(test);
    } catch (err) {
      console.log(err.message);
      continue;
    }

    newCol.innerHTML =
      '<div class="addStuff" onclick="addTaskDialog(' +
      obj.num +
      ')">+ Add task...</div>';
    var container = document.createElement("div");
    container.setAttribute("class", "column");
    container.setAttribute("id", "contCol" + obj.num);

    document.getElementById("colData").appendChild(container);
    document.getElementById("contCol" + obj.num).appendChild(cName);
    document.getElementById("contCol" + obj.num).appendChild(newCol);

    for (var element in obj.data) {
      var newTask = document.createElement("ons-list-item");
      try {
        newTask.innerHTML = obj.data[element].taskName;
        //console.log(obj.data[element].taskName);
      } catch (err) {
        console.log(err.message);
        continue;
      }
      newTask.setAttribute("class", "taskClass");
      test = document.createElement("div");
      test.setAttribute("class", "itemPic");
      test.setAttribute("onclick", "editDialog(" + i + "," + element + ")");
      test.innerHTML =
        '<img src="img/edit.png" style="width:30px;length:40px;">';

      newTask.appendChild(test);

      test = document.createElement("div");
      test.setAttribute("class", "itemPic");
      test.setAttribute("onclick", "delItem(" + i + "," + element + ")");
      test.innerHTML =
        '<img src="img/delete.png" style="width:20px;length:25px;">';
      newTask.appendChild(test);

      document.getElementById("column" + obj.num).appendChild(newTask);
    }
  }
}

function removeAll() {
  ons.notification.alert("Removed All Items");
  $("#todoList").empty();
  localStorage.clear();
  colNum = localStorage.length;
  showData();
}

document.addEventListener("init", function (event) {
  showData();
  timedFunction();
});

function addTask(idCol, num) {
  colID = "column" + idCol;
  var taskName = $("#taskName").val();
  var dateD = $("#taskDate").val();
  var textArea = $("#taskText").val();
  var notif = document.getElementById("notifON").checked;
  var done = document.getElementById("doneCheck").checked;

  existing = localStorage.getItem(colID);

  existing = JSON.parse(existing);

  console.log(existing["data"]);
  if (Object.keys(existing.data).length == 0) {
    existing["data"] = {
      [num]: {
        taskName: taskName,
        due: dateD,
        text: textArea,
        notifications: notif,
        done:done,
      },
    };
  } else {
    newD = {
      [num]: {
        taskName: taskName,
        due: dateD,
        text: textArea,
        notifications: notif,
        done: done,
      },
    };

    existing["data"] = Object.assign({}, existing["data"], newD);
  }

  console.log(Object.keys(existing.data).length);
  localStorage.setItem("column" + idCol, JSON.stringify(existing));

  showData();
}

function addTaskDialog(idCol) {
  var num = $("#column" + idCol + " > ons-list-item").length;
  document.getElementById("taskDialog").show();
  var btn = document.getElementById("push-button4");
  btn.innerHTML = "Add task";
  btn.setAttribute("onclick", "addTask(" + idCol + "," + num + ")");
}

function delItem(i, j) {
  var k = localStorage.key(i);

  obj = JSON.parse(localStorage.getItem(k));

  delete obj.data[j];

  var existingKeys = Object.keys(obj.data);
  for (var x = 0; x < existingKeys.length; x++) {
    if (existingKeys[x] > j) {
      obj.data[j] = obj.data[existingKeys[x]];
      j++;
      delete obj.data[existingKeys[x]];
      break;
    }
  }
  localStorage.setItem(localStorage.key(i), JSON.stringify(obj));
  showData();
}

function delCol(k) {
  //obj = JSON.parse(JSON.stringify(localStorage));

  localStorage.removeItem(k);
  /* var existingKeys = Object.keys(obj.data);
  idx = k.match(/\d+/);
  for (var i = 0;i<existingKeys.length;i++){
    if(existingKeys[x].match(/\d+/)>idx){
      obj = JSON.parse(localStorage.getItem(existingKeys[x]));
      localStorage.setItem(k, JSON.stringify(obj));
      localStorage.removeItem(k);
      idx++
    }
  }
  */
  showData();
}

function editDialog(i, j) {
  document.getElementById("taskDialog").show();

  var k = localStorage.key(i);

  obj = JSON.parse(localStorage.getItem(k));

  $("#taskName").val(obj.data[j].taskName);
  $("#taskText").val(obj.data[j].text);
  $("#taskDate").val(obj.data[j].due);
  $("#notifON").prop("checked", obj.data[j].notifications);
  $("#doneCheck").prop("checked", obj.data[j].done);
  $("#push-button4").html("Edit task");
  $("#push-button4").attr("onclick", "editTask(" + i + "," + j + ")");
}

function editTask(i, j) {
  var k = localStorage.key(i);

  obj = JSON.parse(localStorage.getItem(k));

  obj.data[j].taskName = $("#taskName").val();
  obj.data[j].text = $("#taskText").val();
  obj.data[j].due = $("#taskDate").val();
  obj.data[j].notifications = document.getElementById("notifON").checked;
  obj.data[j].done = document.getElementById("doneCheck").checked;

  localStorage.setItem(localStorage.key(i), JSON.stringify(obj));
  document.getElementById("taskDialog").hide();
  showData();
  ons.notification.toast("Task edited!", { timeout: 2000 });
}

function exportData() {
  var file = new File([JSON.stringify(localStorage)], "onrello-data.txt", {
    type: "text/plain;charset=utf-8",
  });

  saveAs(file);
  ons.notification.toast("File saved!", { timeout: 2000 });
}

function readText(param) {
  if (param.files && param.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var output = e.target.result;

      //document.getElementById('main').innerHTML= output;
      localStorage.clear();
      var data = JSON.parse(output);
      var keys = Object.keys(data);

      for (var x = 0; x < keys.length; x++) {
        data[keys[x]] = JSON.parse(data[keys[x]]);

        localStorage.setItem(keys[x], JSON.stringify(data[keys[x]]));
      }
    };
    reader.readAsText(param.files[0]);
  }
  location.reload();
}

document.addEventListener("init", function (event) {
  var range = $("#volRange");
  //Occurs when the text content of an element is changed through the user interface
  range.on("input", function () {
    var txt = $("#volValue");
    txt.text(range.val());
  });
});

function changeVol(val) {
  $("#volValue").text(val);
}

function changeColor(val) {
  var elements = document.getElementsByClassName("customButton");

  for (var i = 0; i < elements.length; i++) {
    elements[i].style.backgroundColor = val;
  }
  ons.notification.toast("Scheme color changed!", { timeout: 2000 });
}
