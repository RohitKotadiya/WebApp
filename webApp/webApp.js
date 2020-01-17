var users = [], userLogs = [];
let today = new Date().getUTCDate(), month = new Date().getUTCMonth() + 1;

class User {                                            // User Class for subusers
    constructor(userId, userName, userPassword, userEmailId, userDOB) {
        this.userId = userId;
        this.userName = userName;
        this.userPassword = userPassword;
        this.userEmailId = userEmailId;
        this.userDOB = userDOB;
    }
    calculateAge() {
        return this.age = new Date().getFullYear() - new Date(this.userDOB).getFullYear();
    }
}
if (localStorage.getItem("userLogs"))
    userLogs = JSON.parse(localStorage.getItem('userLogs'));
if (localStorage.getItem("users"))
    users = JSON.parse(localStorage.getItem("users"));
function userLogin() {
    var formData = document.getElementById("login-form");
    userEmail = formData.uEmail.value;
    userPass = formData.uPassword.value;
    const atPosition = userEmail.indexOf("@");
    const dotPosition = userEmail.lastIndexOf(".");
    if (atPosition < 1 || dotPosition < atPosition + 2 || dotPosition + 2 >= userEmail.length) {
        alert("Please enter a valid e-mail address");
        return false;
    }
    else {
        var adminData = JSON.parse(localStorage.getItem("admin"));
        var userData = JSON.parse(localStorage.getItem("users"));
        for (i = 0; i < userData.length; i++) {
            if (adminData.Email === userEmail && adminData.Password === userPass) {
                window.location.href = `dashboard.html?userId=${adminData.Email}`;
            }
            if (userData[i].userEmailId === userEmail && userData[i].userPassword === userPass) {
                let loginTime = new Date().toUTCString();
                sessionStorage.setItem("logintime", loginTime);
                window.location.href = `sub_user.html?userId=${userData[i].userId}`;
            }
        }
    }
}
function regiserUser() {
    window.location.href = "registration.html";
}
function adminRegistration(form) {
    var userName = form.uName.value;
    var emailId = form.emailId.value;
    var password = form.uPass.value;
    var confirmPass = form.uConfirmPass.value;
    var city = form.uCity.value;
    var state = form.uState.value;
    var chkBoxValue = form.chkBox;
    var atPos = emailId.indexOf("@");
    var dotPos = emailId.lastIndexOf(".");
    const regEx = /[a-zA-Z]/;
    if (!regEx.test(userName)) {
        alert("Invalid User Name");
        return false;
    }
    else if (atPos < 1 || dotPos < atPos + 2 || dotPos + 2 >= emailId.length) {
        alert("Please enter a valid e-mail address");
        return false;
    }
    else if (password.length == 0 || confirmPass.length == 0) {
        alert("Please Enter Password First");
        return false;
    }
    else if (password !== confirmPass) {
        alert("Both Password Must Same");
        return false;
    }
    else if (city.length == 0) {
        alert("Please Select city ");
        return false;
    }
    else if (state.length == 0) {
        alert("Please select state");
        return false;
    }
    else if (!chkBoxValue.checked) {
        alert("Please accept terms and Conditions");
        return false;
    }
    else {
        var adminObj = {};
        adminObj['Name'] = userName;
        adminObj['Email'] = emailId;
        adminObj['Password'] = password;
        adminObj['City'] = city;
        adminObj['State'] = state;
        localStorage.setItem("admin", JSON.stringify(adminObj));
    }
}
if (localStorage.getItem("admin") != null) {
    // document.getElementById("reg-Btn").style.display="none";
}
function clearData() {
    localStorage.removeItem("users");
}
function clearLogData() {
    localStorage.removeItem("userLogs");
}
function showAdminPanel() {
    var url = window.location.search.substring(1);
    console.log(url);
    const usrEmail = url.split("=");
    let userId = usrEmail[1];
    let adminData = JSON.parse(localStorage.getItem("admin"));
    
    if (adminData.Email == userId) {
        document.getElementById("admin-name").textContent = adminData.Name;
    }
    let userData = JSON.parse(localStorage.getItem("users"));
    let underAge = 0, adult = 0, sinior = 0;
    for (i = 0; i < userData.length; i++) {
        if (userData[i].age < 18)
            underAge++;
        if (userData[i].age >= 18 && userData[i].age < 50) 
            adult++;
        if (userData[i].age >= 50) 
            sinior++;
        if (new Date(userData[i].userDOB).getUTCDate() == today && new Date(userData[i].userDOB).getUTCMonth() + 1 == month)
            document.getElementById("fourth").textContent = "Today is Birthday of " + userData[i].userName;
    }
    document.getElementById("first").textContent = "Less then 18 ==>" + underAge;
    document.getElementById("second").textContent = "Betwwen 18 and 50 ==>" + adult;
    document.getElementById("third").textContent = "grater then 50  ==>" + sinior;
}
function addUser() {
    var subUserForm = document.getElementById("add-user");
    let uName = subUserForm.userName.value;
    let uEmail = subUserForm.userEmail.value;
    let uPassword = subUserForm.userPass.value;
    let uDOB = subUserForm.userDOB.value;
    let uId = new Date().getMilliseconds();
    var newUser = new User(uId, uName, uPassword, uEmail, uDOB);
    newUser.calculateAge();
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
}
function showUsers() {
    let userData = JSON.parse(localStorage.getItem("users"));
    var myTable = document.getElementById("my-table");
    for (var i = 0; i < userData.length; i++) {
        var row = myTable.insertRow();
        row.insertCell(0).textContent = i + 1;
        row.insertCell(1).textContent = userData[i].userName;
        row.insertCell(2).textContent = userData[i].userEmailId;
        row.insertCell(3).textContent = userData[i].userPassword;
        row.insertCell(4).textContent = userData[i].userDOB;
        row.insertCell(5).textContent = userData[i].age;
        row.insertCell(6).innerHTML = `<input type="button" value="Delete" id=${userData[i].userId} name="delete" onclick="deleteRecord(this);">`;
        row.insertCell(6).innerHTML = `<input type="button" value="Edit" id=${userData[i].userId} name="edit" onclick="updateRecord(this);">`;
    }
}
showUsers();
function updateRecord(userId) {
    let subUserFrm = document.getElementById("update-user");
    subUserFrm.style.display = "block";
    let allUsers = JSON.parse(localStorage.getItem("users"));
    for (i = 0; i < allUsers.length; i++) {
        if (allUsers[i].userId == userId.id) {
            subUserFrm.userId.value = allUsers[i].userId;
            subUserFrm.userName.value = allUsers[i].userName;
            subUserFrm.userEmail.value = allUsers[i].userEmailId;
            subUserFrm.userPass.value = allUsers[i].userPassword;
            subUserFrm.userDOB.value = allUsers[i].userDOB;
        }
    }
}
function updateUserData() {
    let allUsers = JSON.parse(localStorage.getItem("users"));
    let updateFrm = document.getElementById("update-user");
    for (i = 0; i < allUsers.length; i++) {
        if (updateFrm.userId.value == allUsers[i].userId) {
            allUsers[i].userName = updateFrm.userName.value;
            allUsers[i].userEmailId = updateFrm.userEmail.value;
            allUsers[i].userPassword = updateFrm.userPass.value;
            allUsers[i].userDOB = updateFrm.userDOB.value;
            localStorage.setItem("users", JSON.stringify(allUsers));
        }
    }
}
function deleteRecord(userId) {
    let subUserFrm = document.getElementById("add-user");
    let allUsers = JSON.parse(localStorage.getItem("users"));
    for (i = 0; i < allUsers.length; i++) {
        if (allUsers[i].userId == userId.id) {
            allUsers.splice(i, 1);
            localStorage.setItem("users", JSON.stringify(allUsers));
            window.location.href = "user.html";
        }
    }
}
function showSubUser() {
    var url = window.location.search.substring(1);
    const usrId = url.split("=");
    let userId = usrId[1];
    let userData = JSON.parse(localStorage.getItem("users"));
    for (i = 0; i < userData.length; i++) {
        if (userData[i].userId == userId) {
            document.getElementById("subuser-name").textContent = userData[i].userName;
            if (new Date(userData[i].userDOB).getUTCDate() == today && new Date(userData[i].userDOB).getUTCMonth() + 1 == month) {
                document.getElementById("birthday").textContent = "Happy Birthday " + userData[i].userName;
            }
        }
    }
}
function userLogout() {
    user = document.getElementById("subuser-name").textContent;
    loginTime = sessionStorage.getItem("logintime");
    var subUserObj = {};
    logoutTime = new Date().toUTCString();
    subUserObj['loginTime'] = loginTime;
    subUserObj['user'] = user;
    subUserObj['logoutTime'] = logoutTime;
    userLogs.push(subUserObj);
    localStorage.setItem("userLogs", JSON.stringify(userLogs));
    window.location.href = "login.html";
}
function showSession() {
    var logs = JSON.parse(localStorage.getItem("userLogs"));
    var myTable = document.getElementById("session-table");
    for (var i = 0; i < logs.length; i++) {
        var row = myTable.insertRow();
        row.insertCell(0).textContent = logs[i].user;
        row.insertCell(1).textContent = logs[i].loginTime;
        row.insertCell(2).textContent = logs[i].logoutTime;
    }
}