import common_en from "./en/common";
import common_sl from "./sl/common";

type Dict = Record<string, Record<string, any>>;

export const dict: Dict = {
	en: {
		...common_en,
	},
	sl: {
		...common_sl,
	},
};
