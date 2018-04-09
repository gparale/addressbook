buttonSelection = document.getElementsByClassName("left_options")
frames = document.getElementsByClassName("right_window")

document.getElementById("add").addEventListener("click", () => {
    document.getElementById("addContact").style.display = "block";
    document.getElementById("updateInfo").style.display = "none";
})

document.getElementById("update").addEventListener("click", () => {
    document.getElementById("addContact").style.display = "none";
    document.getElementById("updateInfo").style.display = "block";
})

window.onclick = function(event) {
    if ((event.target == document.getElementById("addContact")) || (event.target == document.getElementById("updateInfo"))) {
        document.getElementById("addContact").style.display = "none";
        document.getElementById("updateInfo").style.display = "none"
    }
    if (event.target == document.getElementById("a_view")) {
        document.getElementById("a_updateRev").src = "https://www.google.com/maps/embed/v1/place?key=AIzaSyBo7uKcrJKGkcPuoKgo-Si-pNHAHE4V-5U&q=" + document.getElementById("a_address").value
     
    }
    if (event.target == document.getElementById("u_view")) {
        document.getElementById("u_updateRev").src = "https://www.google.com/maps/embed/v1/place?key=AIzaSyBo7uKcrJKGkcPuoKgo-Si-pNHAHE4V-5U&q=" + document.getElementById("u_address").value
     
    }
}

document.getElementById("add_contact").addEventListener("click", ()=>{
	fetch("/addcontact", {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
            "fname": document.getElementById("fname").value,
            "lname": document.getElementById("lname").value,
            "phone": document.getElementById("a_phone").value,
            "address": document.getElementById("a_address").value
		})
	}).then((response)=>{
		return response.json()
	}).then((json)=>{
		if (json.status === "OK"){
			window.location.assign("/hub")
		} else {
			alert(json.message)
		}
	})
})

document.getElementById("update_info").addEventListener("click", ()=>{
	fetch("/update", {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
            "phone": document.getElementById("u_phone").value,
            "address": document.getElementById("u_address").value
		})
	}).then((response)=>{
		return response.json()
	}).then((json)=>{
		if (json.status === "OK"){
			window.location.assign("/hub")
		} else {
			alert(json.message)
		}
	})
})

document.getElementById("logout").addEventListener("click", ()=>{
	fetch("/logout", {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
            "command": "End Session"
		})
	}).then((response)=>{
		return response.json()
	}).then((json)=>{
		if (json.status === "OK"){
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
