document.getElementById("testme").addEventListener("click", () => {
	fetch('/resources', {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			"name": "Glenn",
			"pass": "slit"
		})
	}).then((response) => {
		return response.json()
	}).then((json)=>{
		window.location.assign(json.url)
	});
});