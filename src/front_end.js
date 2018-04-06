
document.getElementById("loginAccount").addEventListener("click", () => {
	fetch('/login', {
		method: "POST",
        credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
            "name": document.getElementById("loginUser").value,
			"pass": document.getElementById("loginPwd").value
		})
	}).then((response) => {
        return response.json();
	}).then((json)=>{
		if(json.message === "Login Successful"){
			window.location.assign(json.url)
		}else{
			alert("Login Failed");
		}
    });
});

document.getElementById("createAccount").addEventListener("click", () => {
	fetch('/signup', {
		method: "POST",
        credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
            "fname": document.getElementById("fname").value,
            "lname": document.getElementById("lname").value,
			"uname": document.getElementById("signupUser").value,
			"pword": document.getElementById("signupPwd").value,
            "cpword": document.getElementById("confirmPwd").value
		})
	}).then((response) => {
        return response.json();
	}).then((json)=>{
		if(json.message === "Signup Successful"){
			window.location.assign(json.url)
		}else{
			alert("Signup Failed");
		}
        
    });
});

// Get the modal
var signModal = document.getElementById('signupModal');
var logModal = document.getElementById('loginModal');

document.getElementById("signup").addEventListener("click", () => {
	signModal.style.display = "block";
})

document.getElementById("login").addEventListener("click", () => {
	logModal.style.display = "block";
})

// When the user clicks on <span> (x), close the modal
document.getElementsByClassName("close")[0].onclick = function() {
    signModal.style.display = "none";
    //logModal.style.display = "none";
}

document.getElementsByClassName("close")[1].onclick = function() {
    logModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if ((event.target == signModal) || (event.target == logModal)) {
        signModal.style.display = "none";
        logModal.style.display = "none";
    }
}