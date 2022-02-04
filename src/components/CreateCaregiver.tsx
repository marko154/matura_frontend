import { useI18n } from "@amoutonbrady/solid-i18n";
import { useNavigate } from "solid-app-router";
import { Component } from "solid-js";
import { createStore } from "solid-js/store";
import { createCaregiver } from "../http/caregivers";
import { MainWrapper } from "./common/MainWrapper";
import { Input } from "./common/Input/Input";
import { Button } from "./common/Button/Button";
import createDebounce from "@solid-primitives/debounce";
import { TextArea } from "./common/TextArea";
import { Map } from "./common/Map";
import { SelectMentor } from "./SelectMentor";
import { mentorSidemenu } from "../constants/sidemenu";

const CreateCaregiver: Component = () => {
	const [t] = useI18n();
	const navigate = useNavigate();
	const [fn, cancel] = createDebounce(() => {}, 300);

	const [caregiver, setCaregiver] = createStore<any>({
		email: "",
		first_name: "",
		last_name: "",
		emso: "",
		date_of_birth: "",
		gender: "MALE",
		phone_number: "",
		additional_info: "",
		mentor_id: -1,
		location: {},
	});

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		try {
			const res = await createCaregiver(caregiver);
			console.log(res);
			// navigate(`/mentor/${user.user_id}`, { replace: true });
		} catch (err) {
			console.log(err);
		}
	};

	const handleChange = (e: any) => {
		setCaregiver(e.target.name, e.target.value);
	};

	const canSubmit = () => {
		return Object.values(caregiver).every((val) => val !== "");
	};

	const handleMapResult = (result: any) => {
		setCaregiver("location", result);
	};

	const handleSelectMentor = (mentor: Mentor) => {
		console.log(mentor);
		setCaregiver("mentor_id", mentor.mentor_id);
	};

	return (
		<MainWrapper title={t("caregiver.createCaregiver")}>
			<div className="flex">
				<form style="min-width: 500px;" className="mr-5">
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
					<Input
						label="EMŠO"
						onInput={handleChange}
						name="emso"
						maxLength={13}
					/>
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
					<TextArea
						label={"Additional information"}
						onInput={handleChange}
						name="additional_info"
					/>
				</form>
				<Map onResult={handleMapResult} className="flex-1" />
			</div>

			<SelectMentor
				mentorID={caregiver.mentor_id}
				setMentor={handleSelectMentor}
				className="my-5"
			/>

			<Button onClick={handleSubmit} disabled={!canSubmit()} className="w-fit">
				{t("create")}
			</Button>
		</MainWrapper>
	);
};

export default CreateCaregiver;
