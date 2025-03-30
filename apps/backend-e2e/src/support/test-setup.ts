import axios from "axios";

// biome-ignore lint/complexity/useArrowFunction: <explanation>
module.exports = async function () {
	// Configure axios for tests to use.
	const host = process.env.HOST ?? "localhost";
	const port = process.env.PORT ?? "3000";
	axios.defaults.baseURL = `http://${host}:${port}`;
};
