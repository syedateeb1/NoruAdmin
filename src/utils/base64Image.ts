export const isBase64 = (str: string) => {
  try {
    return (
      str &&
      typeof str === "string" &&
      /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(
        str,
      )
    );
  } catch (e) {
    return false;
  }
};
