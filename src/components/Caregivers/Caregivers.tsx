import { useI18n } from "@amoutonbrady/solid-i18n";
import { Component } from "solid-js";
import { MainWrapper } from "../common/MainWrapper";
import { Sidebar } from "../Sidebar/Sidebar";
import { CaregiversMap } from "./CaregiversMap";

const Caregivers: Component = () => {
	const [t] = useI18n();

	return (
		<MainWrapper title={t("sidebar.caregivers")}>
			<div className="flex flex-1">
				<CaregiversMap />
				<Sidebar className="w-96 flex-0 border-l-2"></Sidebar>
			</div>
		</MainWrapper>
	);
};

export default Caregivers;
