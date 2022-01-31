interface SidemenuItem {
	text: string;
	path: string;
	end?: boolean;
}

export const adminSidemenu: SidemenuItem[] = [
	{
		text: "sidebar.home",
		path: "/",
		end: true,
	},
	{
		text: "sidebar.patients",
		path: "/patients",
	},
	{
		text: "sidebar.caregivers",
		path: "/caregivers",
	},
	{
		text: "sidebar.mentors",
		path: "/mentors",
	},
];

export const mentorSidemenu: SidemenuItem[] = [
	{
		text: "sidebar.home",
		path: "/",
	},
	{
		text: "sidebar.caregivers",
		path: "/caregivers",
	},
	{
		text: "sidebar.patients",
		path: "/patients",
	},
];

export const caregiverSidemenu: SidemenuItem[] = [
	{
		text: "sidebar.home",
		path: "/",
	},
	{
		text: "sidebar.patients",
		path: "/patients",
	},
];

export const ROLE_SIDEMENU: { [role: number]: SidemenuItem[] } = {
	1: adminSidemenu,
	2: mentorSidemenu,
	3: caregiverSidemenu,
};
