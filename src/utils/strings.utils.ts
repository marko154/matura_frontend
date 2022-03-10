const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const isValidEmail = (emailAdress: string) => {
  return regexEmail.test(emailAdress);
};

export const formatDate = (date: string | Date, locale?: string) => {
  const dateTime = new Date(date);
  return dateTime.toLocaleDateString(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const contains = (str1: string, str2: string) => {
  return str1.toLowerCase().includes(str2.toLowerCase());
};

// returns an array of segments with text and highlighted properties
export const getHighlightedSegments = (string: string, highlighted: string) => {
  if (highlighted === "") return [{ text: string, highlighted: false }];
  const segments = [];
  let hIdx;
  while (true) {
    hIdx = string.toLowerCase().indexOf(highlighted.toLowerCase());
    if (hIdx === -1) break;

    segments.push(
      {
        text: string.substring(0, hIdx),
        highlighted: false,
      },
      {
        text: string.substring(hIdx, highlighted.length),
        highlighted: true,
      }
    );

    string = string.substring(hIdx + highlighted.length);
  }
  segments.push({ text: string, highlighted: false });

  return segments;
};
