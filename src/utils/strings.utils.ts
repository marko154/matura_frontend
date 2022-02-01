export const isValidEmail = (emailAdress: string) => {
	const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return regexEmail.test(emailAdress);
};

export const formatDate = (date: string | Date, locale?: string) => {
	const dateTime = new Date(date);
	return dateTime.toLocaleDateString(locale, {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
};
