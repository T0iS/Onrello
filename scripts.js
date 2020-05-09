var colNum = localStorage.length;

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
    try{
    newCol.setAttribute("id", "column" + obj.num);
    cName.setAttribute("onclick","delCol('column" + obj.num+"');");
    cName.innerHTML = obj.name;
    }
    catch(err){
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
        console.log(obj.data[element].taskName);
      } catch (err) {
        console.log(err.message);
        continue;
      }
      var test = document.createElement("div");
      test.setAttribute("class", "itemPic");
      test.setAttribute("onclick", "editDialog(" + i + "," + element + ")");
      test.innerHTML = '<img src="edit.png" style="width:30px;length:40px;">';

      newTask.appendChild(test);

      test = document.createElement("div");
      test.setAttribute("class", "itemPic");
      test.setAttribute("onclick", "delItem(" + i + "," + element + ")");
      test.innerHTML = '<img src="delete.png" style="width:20px;length:25px;">';
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
});

function addTask(idCol, num) {
  colID = "column" + idCol;
  var taskName = $("#taskName").val();
  var dateD = $("#taskDate").val();
  var textArea = $("#taskText").val();
  var notif = document.getElementById("notifON").checked;

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
  btn.setAttribute("onclick", "addTask(" + idCol + "," + num + ")");
}

function delItem(i, j) {
  var k =  localStorage.key(i);           

  obj = JSON.parse(localStorage.getItem(k));

  delete obj.data[j];
  
  var existingKeys = Object.keys(obj.data);
  for(var x = 0; x<existingKeys.length;x++){
    if (existingKeys[x] > j){
      obj.data[j] = obj.data[existingKeys[x]];
      j++;
      delete obj.data[existingKeys[x]];
      break;
    }
  }
  localStorage.setItem(localStorage.key(i), JSON.stringify(obj));
  showData();
}


function delCol(k){

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

  localStorage.setItem(localStorage.key(i), JSON.stringify(obj));
  document.getElementById("taskDialog").hide();
  showData();
  ons.notification.toast("Task edited!", { timeout: 2000 });
}

function exportData() {
  var file = new File([JSON.stringify(localStorage)], "datafile.txt", {
    type: "text/plain;charset=utf-8",
  });

  saveAs(file);
}
