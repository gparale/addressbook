buttonSelection = document.getElementsByClassName("left_options")
frames = document.getElementsByClassName("right_window")

var signModal = document.getElementById('signupModal');

document.getElementById("add").addEventListener("click", () => {
    document.getElementById("addContact").style.display = "block";
    document.getElementById("updateInfo").style.display = "none";
})

window.onclick = function(event) {
    if (event.target == document.getElementById("addContact")) {
        document.getElementById("addContact").style.display = "none"
    }
}

document.getElementById("add_contact").addEventListener("click", () => {
    fetch("/addcontact", {
        method: "POST",
        credientials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "fname": document.getElementById("fname").value,
            "lname": document.getElementById("lname").value,
            "phone": document.getElementById("a_phone").value,
            "address": document.getElementById("a_address").value
        })
    }).then((response) => {
        return response.json()
    }).then((json) => {
        if (json.status === "OK") {
            window.location.assign("/hub")
        } else {
            alert(json.message)
        }
    })
})

document.getElementById("update").addEventListener("click", () => {
    document.getElementById("updateInfo").style.display = "block";
    document.getElementById("addContact").style.display = "none";
})

document.getElementById("update_info").addEventListener("click", () => {
    fetch("/update", {
        method: "POST",
        credientials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "phone": document.getElementById("u_phone").value,
            "address": document.getElementById("u_address").value
        })
    }).then((response) => {
        return response.json()
    }).then((json) => {
        if (json.status === "OK") {
            window.location.assign("/hub")
        } else {
            alert(json.message)
        }
    })
})

document.getElementById("logout").addEventListener("click", () => {
    fetch("/logout", {
        method: "POST",
        credientials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "command": "End Session"
        })
    }).then((response) => {
        return response.json()
    }).then((json) => {
        if (json.status === "OK") {
            window.location.assign("/")
        }
    })
})

for (i = 0; i < buttonSelection.length; i++) {
	button_id = buttonSelection[i].id
	document.getElementById(button_id).addEventListener("click", function(){ //Use the function() instead of ()=>{} when referring to this.something

		for (i = 0; i < frames.length; i++) {
			frames[i].style.display = "none"
		}

		element = this.id
		pos = element.indexOf("_button")
		e2 = element.slice(0 ,pos)

		document.getElementById(e2).style.display = "block"
	})
}
