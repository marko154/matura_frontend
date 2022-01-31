let lastId = 0;

const generateUniqueID = (prefix = "id") => {
	lastId++;
	return `${prefix}${lastId}`;
};

export { generateUniqueID };
