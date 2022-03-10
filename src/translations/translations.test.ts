import { isObject } from "../utils/general.utlis";
import { dict } from "./index";

test("all translations should have the same fields", () => {
  const validate = (objects: any[]) => {
    for (const key in objects[0]) {
      for (const obj of objects.slice(1)) {
        if (!(key in (obj as any)) || typeof objects[0] !== typeof obj) {
          return false;
        }
      }
      if (isObject(objects[0][key])) {
        if (!validate(objects.map((o) => o[key]))) {
          return false;
        }
      }
    }

    return true;
  };

  expect(validate(Object.values(dict))).toBe(true);
});
