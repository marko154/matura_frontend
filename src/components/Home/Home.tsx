import { useI18n } from "@amoutonbrady/solid-i18n";
import { Component } from "solid-js";
import { MainWrapper } from "../common/MainWrapper";

const Home: Component = () => {
	const [t] = useI18n();
	return (
		<MainWrapper title={t("sidebar.home")}>
			<h1>Recent activity</h1>
			<h1>Recently added users</h1>
		</MainWrapper>
	);
};

export default Home;
