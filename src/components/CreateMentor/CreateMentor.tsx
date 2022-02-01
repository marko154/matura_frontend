import { useI18n } from "@amoutonbrady/solid-i18n";
import { Component } from "solid-js";
import { createStore } from "solid-js/store";
import { MainWrapper } from "../common/MainWrapper";
import createDebounce from "@solid-primitives/debounce";
import { Input } from "../common/Input/Input";
import { Button } from "../common/Button/Button";
import { createMentor } from "../../http/mentors";

const CreateMentor: Component = () => {
	const [t] = useI18n();
	const [fn, cancel] = createDebounce(() => {}, 300);

	const [mentor, setMentor] = createStore<Mentor & { email: string }>({
		email: "",
		first_name: "",
		last_name: "",
		emso: "",
		date_of_birth: "",
		gender: "MALE",
		phone_number: "",
	});

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		try {
			await createMentor(mentor);
			console.log("success");
		} catch (err) {
			console.log(err);
		}
	};

	const handleChange = (e: any) => {
		setMentor(e.target.name, e.target.value);
	};

	return (
		<MainWrapper title={t("mentor.createMentor")}>
			<form>
				<Input
					type="email"
					label={t("email")}
					onInput={handleChange}
					name="email"
				/>
				<Input
					label={t("firstName")}
					onInput={handleChange}
					name="first_name"
				/>
				<Input
					label={t("lastName")}
					onInput={handleChange}
					name="last_name"
				/>
				<Input label="EMŠO" onInput={handleChange} name="emso" />
				<Input
					label={t("phoneNumber")}
					onInput={handleChange}
					name="phone_number"
					type="tel"
				/>
				<Input
					type="date"
					label={t("dateOfBirth")}
					onInput={handleChange}
					name="date_of_birth"
				/>
				<Button onClick={handleSubmit}>{t("create")}</Button>
			</form>
		</MainWrapper>
	);
};

export default CreateMentor;
