
class Item 
{
    constructor(name, price) {
      this.name = name;
      this.price = parseInt(price);
    }
}

class User 
{
    constructor(name) {
      this.name = name;
      this.orderHistory = {};
    }

    AddPurchasedItem(item)
    {
        if (this.orderHistory[item])
        {
            this.orderHistory[item]++;
        }
        else
        {
            this.orderHistory[item] = 1;
        }
    }
}

function SaveToLocalStorage()
{
    localStorage.data = JSON.stringify(data);
}

function AddNewUser(name)
{
    var alreadyExists = false;
    data.users.forEach (user => { if (user.name == name) alreadyExists = true; });
    if (alreadyExists)
        return;

    let newUser = new User(name);
    data.users.push(newUser);

    RefreshUsersSelectUI();
    SaveToLocalStorage();
}

function AddNewItem(name, price)
{
    name = name.toLowerCase();
    name = name.trim();
    price = price == "" ? 0 : price;

    var alreadyExists = false;
    data.availableItems.forEach (item => 
        {
            if (item.name == name)
            {
                alreadyExists = true;
                item.price = parseInt(price);
            }
        });
    
    if (!alreadyExists)
    {
        let newItem = new Item(name, price);
        data.availableItems.push(newItem);
    }
    else
    {
        RefreshStatisticsUI();
    }

    RefreshItemsUI();
    SaveToLocalStorage();
}

function PurchaseRound(item, userList)
{
    if (!item || users.length == 0)
    {
        return;
    }

    let itemName = item.name;
    let userNamesList = [];

    for (user of userList)
    {
        user.AddPurchasedItem(itemName);
        userNamesList.push(user.name);
    }
    
    itemName = item.name;
    purchaseTime = Date.now();
    orderHistoryEntry = {itemName, userNamesList, purchaseTime};
    data.orderHistory.push(orderHistoryEntry);  
    
    RefreshStatisticsUI();
    SaveToLocalStorage(); 
}

function Reset()
{
    data.users = [];
    data.availableItems = [];
    data.orderHistory = [];

    SaveToLocalStorage();
    location.reload();
}

function RemoveAllChildren(domElement)
{
    var child = domElement.lastElementChild; 
        while (child) {
            domElement.removeChild(child);
            child = domElement.lastElementChild;
        }
}

function RefreshItemsUI()
{
    RemoveAllChildren(document.getElementById("itemsDiv"));

    data.availableItems.forEach(item => AddItemSelectUI(item));
}

function AddItemSelectUI(item)
{
    const newDiv = document.createElement("div");

    const inputElem = document.createElement("input");
    inputElem.setAttribute("class", "form-check-input");
    inputElem.type = "radio";
    inputElem.name = "selectedItem";
    inputElem.id = item.name+"_radio";
    inputElem.value = item.name;

    let labelElem = document.createElement("label");
    labelElem.setAttribute("class", "form-check-label");
    labelElem.setAttribute("for", item.name+"_radio");
    labelElem.innerText = item.name;

    let spanElem = document.createElement("span");
    spanElem.innerText = " ";

    inputElem.onclick = function()
    {
        document.getElementById('newItemNameInput').value = item.name;
        document.getElementById('newItemPriceInput').value = item.price;
    }
    
    const textElem = document.createTextNode(item.name + "  " + item.price + " RSD");

    newDiv.appendChild(inputElem);
    newDiv.appendChild(spanElem);
    newDiv.appendChild(labelElem);

    document.getElementById("itemsDiv").appendChild(newDiv);
}

function RefreshUsersSelectUI()
{
    RemoveAllChildren(document.getElementById("usersDiv"));

    data.users.forEach(user => AddUsersSelectUI(user));
}

function AddUsersSelectUI(user)
{
    const newDiv = document.createElement("div");
    newDiv.classList.add("form-check");

    const inputElem = document.createElement("input");
    inputElem.setAttribute("class", "form-check-input");
    inputElem.type = "checkbox";
    inputElem.name = "selectedUsers";
    inputElem.id = user.name+"_checkbox";
    inputElem.value = user.name;

    let labelElem = document.createElement("label");
    labelElem.setAttribute("class", "form-check-label");
    labelElem.setAttribute("for", user.name+"_checkbox");
    labelElem.innerText = user.name;

    let spanElem = document.createElement("span");
    spanElem.innerText = " ";

    newDiv.appendChild(inputElem);
    newDiv.appendChild(spanElem);
    newDiv.appendChild(labelElem);

    document.getElementById("usersDiv").appendChild(newDiv);
}

function GetUserByName(name)
{
    for (let i=0; i<data.users.length; i++)
    {
        if (name.toLowerCase() == data.users[i].name.toLowerCase())
        {
            return data.users[i];
        }
    }
}

function GetItemByName(name)
{
    for (let i=0; i<data.availableItems.length; i++)
    {
        if (name.toLowerCase() == data.availableItems[i].name.toLowerCase())
        {
            return data.availableItems[i];
        }
    }
}

function GetSelectedItem()
{
    var radioButtons = document.getElementsByName('selectedItem');
    for (var radioButton of radioButtons) {
        if (radioButton.checked)
        {
            return GetItemByName(radioButton.value);
        }
    }
    return null;
}

function GetSelectedUsers()
{
    let selectedUsers = [];
    
    var checkboxes = document.getElementsByName('selectedUsers');
    for (var checkbox of checkboxes) {
        if (checkbox.checked)
        {
            selectedUsers.push(GetUserByName(checkbox.value));
        }
    }
    return selectedUsers;
}

function SelectAllUsers()
{
    let value = document.getElementById("selectAll").checked;

    var checkboxes = document.getElementsByName('selectedUsers');
    for (var checkbox of checkboxes) {
        checkbox.checked = value;
    }
}

function AddRoundFromSelected()
{
    item = GetSelectedItem();
    users = GetSelectedUsers();
    
    PurchaseRound(item, users);
    DeselectAll();
}

function DeselectAll()
{
    var users = Array.from(document.getElementsByName('selectedUsers'));
    var items = Array.from(document.getElementsByName('selectedUsers'));
    var combined = users.concat(items);
    for (object of combined)
    {
        object.checked = false;
    }
}

function CreateRow(columns)
{
    const newRow = document.createElement("tr");

    for (column of columns)
    {
        newRow.appendChild(CreateColumn(column));
    }

    return newRow;
}

function RefreshOrderHistoryUI()
{
    RemoveAllChildren(document.getElementById("orderHistoryDiv"));

    let orderHistoryTable = document.getElementById("orderHistoryDiv");
    orderHistoryTable.appendChild(CreateRow(["Item","Number", "Users ordered", "Time"]));

    for (order of data.orderHistory)
    {
        orderHistoryTable.appendChild(
            CreateRow(
            [
                order.itemName,
                order.userNamesList.length,
                order.userNamesList,
                (new Date(order.purchaseTime)).toLocaleTimeString()
            ]
            ))
    }
}

function CreateColumn(text)
{
    let column = document.createElement("th");
    column.innerText = text;
    return column;
}

function AddSummaryByItemUI(itemName, number, price, totalCost)
{
    newRow.appendChild(CreateColumn(itemName));
    newRow.appendChild(CreateColumn(number));
    newRow.appendChild(CreateColumn(price));
    newRow.appendChild(CreateColumn(totalCost));

    document.getElementById("summaryByItem").appendChild(newRow);
}

function CreateTableSummaryByItem(dict)
{
    let table = document.createElement("table");
    table.setAttribute("class", "table table-striped table-hover");
    table.appendChild(CreateRow(["Item", "Number", "Price", "Total"]));
    let total = 0;

    for (const [key, value] of Object.entries(dict)) {
        let itemName = key;
        let number = value;
        let price = GetItemByName(itemName).price;
        let totalByItem = (number*price);

        table.appendChild(CreateRow([itemName, number, price+" RSD", totalByItem+" RSD"]));
        total += totalByItem;
    }

    let totalRow = CreateRow(["", "", ""]);
    let lastColumn = CreateColumn(total +" RSD");
    lastColumn.style = "border:5px solid black !important;";
    totalRow.appendChild(lastColumn);

    table.appendChild(totalRow);

    return table;
}

function RefreshSummaryByItemUI()
{
    let div = document.getElementById("summaryByItem");
    RemoveAllChildren(div);

    let itemDict = {};

    for (order of data.orderHistory)
    {
        if (itemDict[order.itemName])
        {
            itemDict[order.itemName] += order.userNamesList.length;
        }
        else
        {
            itemDict[order.itemName] = order.userNamesList.length;
        }
    }

    div.appendChild(CreateTableSummaryByItem(itemDict));
}

function CreateParagraph(text)
{
    let paragraph = document.createElement("p");
    paragraph.innerText = text;
    return paragraph;
}

function RefreshSummaryByUsersUI()
{
    let div = document.getElementById("summaryByUser");
    RemoveAllChildren(div);

    for (user of data.users)
    {
        div.appendChild(CreateParagraph(user.name));

        div.appendChild(CreateTableSummaryByItem(user.orderHistory));
    }
}


function RefreshStatisticsUI()
{
    RefreshOrderHistoryUI();
    RefreshSummaryByItemUI();
    RefreshSummaryByUsersUI();
}

window.addEventListener('load', (event) => {

    if (localStorage.data === undefined)
    {
        data = {users : [], availableItems : [], orderHistory : []};
    }
    else
    {
        data = JSON.parse(localStorage.data);

        for (user of data.users)
        {
            Object.setPrototypeOf(user, User.prototype);
        }
        
        for (item of data.availableItems)
        {
            Object.setPrototypeOf(item, Item.prototype);
        }
    }

    RefreshItemsUI();
    RefreshUsersSelectUI();

    RefreshStatisticsUI();
});