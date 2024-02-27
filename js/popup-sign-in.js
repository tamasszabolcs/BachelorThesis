document.addEventListener("DOMContentLoaded", () => {
  document.body.onkeyup = function () {
    var text_username = document.getElementById("username");
    var text_password = document.getElementById("password");
    var text_button = document.getElementById("sbm");

    if (text_username.value == "" || text_password.value == "") {
      text_button.style.backgroundColor = "rgb(165, 163, 163)";
    } else {
      text_button.style.backgroundColor = "rgba(226, 19, 19, 0.801)";
    }
  };

  document.getElementById("sbm").addEventListener("click", addUser);
  var credentials = JSON.parse(localStorage.getItem("UserList"));
  var username = "";
  var password = "";
  if (credentials) {
    username = credentials[0];
    password = credentials[1];
  }

  if (username && password) {
    //if username and password exists
    afterSuccessfullLoginActions();
  }
});

let addUser = async (ev) => {
  ev.preventDefault();
  let user = {
    uname: document.getElementById("username").value,
    pass: document.getElementById("password").value,
  };

  let username_error = document.getElementById("username");
  let password_error = document.getElementById("password");

  if (user.uname == null || user.pass == null) {
    username_error.style.border = "2px solid red";
    password_error.style.border = "2px solid red";
    return;
  }

  var bearerToken = await getBearerLoginToken(user.uname, user.pass);

  if (bearerToken != null) {
    afterSuccessfullLoginActions();
    //base64
    var encodedString = btoa(user.pass); //accepts a “string” where each character represents an 8-bit byte
    //console.log(encodedString);
    var users = [];
    users.push(user.uname, encodedString);
    localStorage.setItem("UserList", JSON.stringify(users)); //save the array into local storage
  } else {
    username_error.style.border = "2px solid red";
    password_error.style.border = "2px solid red";
  }
};

async function getBearerLoginToken(user_name, pass_word) {
  const requestURL =
    "https://tm2.carparts-cat.com/data/TM.Next.Authority/api/shell/login/v1/GetAuthToken";
  //web api fuggveny amit felhivunk
  //ez kapja meg a username es passwordot es visszateriti a kapott tokent
  var inputData = {
    authId: "v2fa", //bearer token id-ja
    traderId: 0,
    customerNo: "",
    username: user_name,
    password: pass_word,
    languageId: 4, //angol nyelv
    clearExistingSessions: false,
    loginInterface: "",
  };

  try {
    var bToken = null;
    await fetch(requestURL, {
      //fetch fuggveny js
      method: "POST",
      body: JSON.stringify(inputData),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json()) //visszaterit a response objektumot json formatumban
      .then((json) => {
        bToken = json["token"];
      });
    return bToken;
  } catch (err) {
    alert(err.message);
  }
}

chrome.contextMenus.onClicked.addListener(async function (clickData) {
  if (clickData.menuItemId == "spendMoney" && clickData.selectionText) {
    if (isInt(clickData.selectionText)) {
      searchHistory(
        `https://tm2.carparts-cat.com/6yaBuIGw36oq1kmlrow4pk/parts/direct/list/direct?query=${clickData.selectionText}`
      );

      function searchHistory(searchParam) {
        const maxHistoryLength = 3;
        const history = JSON.parse(
          localStorage.getItem("searchHistory") || "[]"
        );
        const isHistoryMaxed = history.length === maxHistoryLength;
        const workingHistory = isHistoryMaxed ? history.slice(1) : history; //ha eleri a max history szamot levagja az elso elemet
        const updatedHistory = workingHistory.concat(searchParam);

        localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
      }

      let credentials = JSON.parse(localStorage.getItem("UserList"));
      let username = credentials[0];
      let password = atob(credentials[1]); //dekodolas
      let bearerToken = await getBearerLoginToken(username, password);
      chrome.tabs.create({
        url: `https://tm2.carparts-cat.com/login?token=${bearerToken}&loginType=1&lang=4`,
      });
      var activeTabId;
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        function (tabs) {
          var currTab = tabs[0];

          if (currTab) {
            //eltaroljuk az aktiv tabID-t
            activeTabId = currTab.id;
          }
        }
      );
      setTimeout(() => {
        chrome.tabs.update(activeTabId, {
          url: `https://tm2.carparts-cat.com/6yaBuIGw36oq1kmlrow4pk/parts/direct/list/direct?query=${clickData.selectionText}`,
        });
      }, 7000);
    } else {
      alert("This is not an integer!");
    }
  }
});

function afterSuccessfullLoginActions() {
  window.location.href = "/html/popup_logout.html";

  let contextMenus;
  if (contextMenus !== "spendMoney") {
    contextMenus = chrome.contextMenus.create({
      title: "CATALOG SEARCH",
      id: "spendMoney",
      contexts: ["selection"],
    });
  }
}
