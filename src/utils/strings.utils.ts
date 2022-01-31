export const isValidEmail = (emailAdress: string) => {
	const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return regexEmail.test(emailAdress);
};
