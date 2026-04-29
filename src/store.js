export const store = {
  finance: {
    assets: 0,
    liabilities: 0,
    monthIncome: 0,
    monthExpenses: 0,
    monthBudget: 0,
    transactions: []
  },
  calendar: {
    todayEvents: []
  }
};

export function resetStore() {
  store.finance = {
    assets: 0,
    liabilities: 0,
    monthIncome: 0,
    monthExpenses: 0,
    monthBudget: 0,
    transactions: []
  };
  store.calendar = { todayEvents: [] };
}
