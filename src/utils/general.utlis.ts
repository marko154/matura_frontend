export const isObject = (x: any) => {
	return typeof x === "object" && !Array.isArray(x) && x !== null;
};
