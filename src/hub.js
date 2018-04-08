buttonSelection = document.getElementsByClassName("left_options")
frames = document.getElementsByClassName("right_window")

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
