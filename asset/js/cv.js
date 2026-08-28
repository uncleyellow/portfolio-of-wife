(() => {
	const langToggle = document.getElementById("langToggle");
	const year = document.getElementById("year");
	let currentLanguage = localStorage.getItem("cv-language") || "vi";

	/*
	 * YEAR
	 */
	year.textContent = new Date().getFullYear();

	/*
	 * LANGUAGE
	 */
	function setLanguage(language) {
		currentLanguage = language;
		document.documentElement.lang = language === "vi" ? "vi" : "en";
		document.querySelectorAll("[data-vi][data-en]")
			.forEach(element => {
				const text = language === "vi" ? element.dataset.vi : element.dataset.en;
				if (text) {
					element.textContent = text;
				}
			});
		document.querySelectorAll("[data-vi-placeholder][data-en-placeholder]")
			.forEach(element => {
				element.placeholder = language === "vi" ? element.dataset.viPlaceholder : element.dataset.enPlaceholder;
			});
		langToggle.textContent = language === "vi" ? "VI" : "EN";
		localStorage.setItem("cv-language", language);
	}

	langToggle.addEventListener("click", () => {
		setLanguage(currentLanguage === "vi" ? "en" : "vi");
	});

	/*
	 * INITIAL LANGUAGE
	 */
	setLanguage(currentLanguage);
  
	/*
	 * KEYBOARD SHORTCUT
	 *
	 * Ctrl/Cmd + P
	 * remains native browser print.
	 */
	document.addEventListener("keydown", event => {
		if (
			(event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "p") {
			// Let browser handle native print.
			return;
		}
		if (event.key.toLowerCase() === "l") {
			setLanguage(currentLanguage === "vi" ? "en" : "vi");
		}
	});
})();
