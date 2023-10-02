const clearNumber = (value = "") => {
  return value.replace(/\D+/g, "");
};

export function formatExpirationDate(value: any) {
  let clearValue: any = clearNumber(value);

  console.log("clearValue", clearValue.substring(0, 1));

  if (clearValue.substring(0, 1) > 1) {
    clearValue = "0" + clearValue;
  }

  if (clearValue.substring(0, 1) == "1" && clearValue.substring(1, 2) > 2) {
    clearValue = "0" + clearValue;
  }
  if (clearValue.length >= 3) {
    return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
  }

  return clearValue;
}
