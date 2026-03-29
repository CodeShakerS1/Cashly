export const barData = [
  { value: 500, label: "Dom" },
  { value: 345, label: "Seg" },
  { value: 654, label: "Ter" },
  { value: 678, label: "Qua" },
  { value: 765, label: "Qui" },
  { value: 78, label: "Sex" },
  { value: 800, label: "Sáb" },
];

export const totalGastos = barData.reduce((acc, item) => {
  return acc + item.value;
}, 0);
