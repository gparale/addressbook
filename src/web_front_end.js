document.getElementById("testme").addEventListener("click", () => {
	fetch('/resources', {
		method: "GET",
		headers: {
			"Content-Type": "application/json"
		},
		body: {
			name: "Glenn",
			pass: "slit"
		}
	}).then((response) => {
		console.log(response);
	});
});