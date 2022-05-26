
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
      this.orderHistory = [];
    }

    AddPurchasedItem(item)
    {
        this.orderHistory.push(item); 
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

    RefreshItemsUI();
    SaveToLocalStorage();
}

function PurchaseRound(itemName, userList)
{
    var userNamesList = [];
    userList.forEach(user => 
        {
            user.AddPurchasedItem(itemName);
            userNamesList.push(user.name);
        });

    data.orderHistory.push({itemName, userNamesList});  

    //Refresh order history UI
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
    inputElem.type = "radio";
    inputElem.name = "selectedItem";
    inputElem.value = item.name;
    
    const textElem = document.createTextNode(item.name + "  " + item.price + " RSD");

    newDiv.appendChild(inputElem);
    newDiv.appendChild(textElem);

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

    const inputElem = document.createElement("input");
    inputElem.type = "checkbox";
    inputElem.name = "selectedUsers";
    inputElem.value = user.name;
    
    const textElem = document.createTextNode(user.name);

    newDiv.appendChild(inputElem);
    newDiv.appendChild(textElem);

    document.getElementById("usersDiv").appendChild(newDiv);
}

window.addEventListener('load', (event) => {

    if (localStorage.data === undefined)
    {
        data = {users : [], availableItems : [], orderHistory : []};
    }
    else
    {
        data = JSON.parse(localStorage.data);
    }

    RefreshItemsUI();
    
    RefreshUsersSelectUI();
});