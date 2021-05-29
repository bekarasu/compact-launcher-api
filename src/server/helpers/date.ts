export const compareFromNow = (date: Date, dateAsDay: number) => {
  return new Date(date).setDate(new Date().getDate() + dateAsDay) < Date.now()
}
