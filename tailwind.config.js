module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "media", // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				primary: "#346CFA",
				"light-blue": "#E9EFFF",
				"dark-blue": "#3E4F7A",
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
