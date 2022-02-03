import { useI18n } from "@amoutonbrady/solid-i18n";
import { Component } from "solid-js";
import { createStore } from "solid-js/store";
import { MainWrapper } from "../common/MainWrapper";
import createDebounce from "@solid-primitives/debounce";
import { Input } from "../common/Input/Input";
import { Button } from "../common/Button/Button";
import { useNavigate } from "solid-app-router";
import { createPatient } from "../../http/patient";
import { Map } from "../common/Map";

const CreatePatient: Component = () => {
	const [t] = useI18n();
	const navigate = useNavigate();
	const [fn, cancel] = createDebounce(() => {}, 300);

	const [patient, setPatient] = createStore<Patient>({
		first_name: "",
		last_name: "",
		email: "",
		emso: "",
		date_of_birth: "",
		gender: "MALE",
		phone_number: "",
		location: undefined,
	});

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		try {
			const res = await createPatient(patient as Patient);
			navigate(`/patient/${res.patient.patient_id}`, { replace: true });
		} catch (err) {
			console.log(err);
		}
	};

	const handleChange = (e: any) => {
		setPatient(e.target.name, e.target.value);
	};

	const canSubmit = () => {
		return Object.values(patient).every((val) => !!val);
	};

	const handleMapResult = (result: any) => {
		setPatient("location", result);
	};

	return (
		<MainWrapper title={t("patient.createPatient")}>
			<div class="flex">
				<form className="max-w-2xl flex-1 mr-5">
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
						type="email"
						label={t("email")}
						onInput={handleChange}
						name="email"
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
					<Button
						onClick={handleSubmit}
						disabled={!canSubmit()}
						className="block ml-auto mt-5"
					>
						{t("create")}
					</Button>
				</form>
				<Map onResult={handleMapResult} />
			</div>
		</MainWrapper>
	);
};

export default CreatePatient;
