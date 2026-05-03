export const barData = [
  { value: 40, label: "D" },
  { value: 40, label: "S" },
  { value: 60, label: "T" },
  { value: 20, label: "Q" },
  { value: 30, label: "Q" },
  { value: 80, label: "S" },
  { value: 10, label: "S" },
];

export const totalGastos = barData.reduce((acc, item) => {
  return acc + item.value;
}, 0);
