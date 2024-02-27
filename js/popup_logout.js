if (localStorage.getItem('UserList') != null) {
  var credentials = JSON.parse(localStorage.getItem('UserList'));
  let username = credentials[0];
  document.getElementById("output").innerHTML = "Logged in as " + username;
 
  //document.getElementById("output").innerHTML = searchHistory(`https://tm2.carparts-cat.com/6yaBuIGw36oq1kmlrow4pk/parts/direct/list/direct?query=${clickData.selectionText}`);
}

let removeUser = async (ev) => {
  ev.preventDefault();
  window.localStorage.removeItem('UserList');
  chrome.contextMenus.remove("spendMoney")
  window.location.href = '/html/popup.html';

}
var el = document.getElementById('logout');
if(el){
  el.addEventListener('click', removeUser)
}

// var last = document.getElementById('lastResults');
// if(last){
//   window.location.href = '/html/popup_searchHistory.html';
// }
//document.getElementById('logout').addEventListener('click', removeUser)

//document.getElementById('last').addEventListener('click', addUser);

