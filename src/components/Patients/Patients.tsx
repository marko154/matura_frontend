import { useI18n } from "@amoutonbrady/solid-i18n";
import { Component } from "solid-js";
import { MainWrapper } from "../common/MainWrapper";

const Patients: Component = () => {
	const [t] = useI18n();
	return <MainWrapper title={t("sidebar.patients")}></MainWrapper>;
};

export default Patients;
