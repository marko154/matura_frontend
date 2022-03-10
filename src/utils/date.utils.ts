export const getAge = (date: Date | string) => {
  const ageDifMs = Date.now() - new Date(date).getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export const getDay = (day: number) => {
  const d = new Date(`01-${5 + day}-1970`);
  return d.toLocaleString(window.navigator.language, { weekday: "long" });
};

export const toDateInputValue = (date: Date | string) => {
  const local = new Date(date);
  return local.toJSON().slice(0, 10);
};
