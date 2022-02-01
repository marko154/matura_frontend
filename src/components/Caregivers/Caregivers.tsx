import { Component, createResource } from "solid-js";
import { useI18n } from "@amoutonbrady/solid-i18n";
import { MainWrapper } from "../common/MainWrapper";
import { Sidebar } from "../Sidebar/Sidebar";
import { CaregiversMap } from "./CaregiversMap";
import { getCaregivers } from "../../http/caregivers";

const Caregivers: Component = () => {
	const [t] = useI18n();
	const [caregivers, {}] = createResource(getCaregivers);

	return (
		<MainWrapper
		// title={t("sidebar.caregivers")}
		>
			<div className="flex flex-1">
				<CaregiversMap />
				<Sidebar className=""></Sidebar>
			</div>
		</MainWrapper>
	);
};

export default Caregivers;
