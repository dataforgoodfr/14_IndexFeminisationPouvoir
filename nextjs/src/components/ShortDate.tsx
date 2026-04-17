export const ShortDate = ({ date }: { date: Date }) =>
  date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
