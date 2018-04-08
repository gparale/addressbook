contacts = document.getElementsByClassName("contacts")

for (i=0; i < contacts.length; i++){
	button_id = contacts[i].id
	document.getElementById(button_id).addEventListener("click", function(){
		info = document.getElementById(this.id + "_info")
		if (info.className == "cont_info"){
			document.getElementById(this.id).style.height = "300px"
			info.className = "cont_info_a"
		}else{
			document.getElementById(this.id).style.height = "25px"
			info.className = "cont_info"
		}
	})
}