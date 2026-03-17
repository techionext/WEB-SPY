const mapKpiDataToChart = (data: any[], valueKey: string) => {
  if (!Array.isArray(data)) return [];

  return data.map((item) => ({
    month: item.date,
    value: item[valueKey],
  }));
};

export default mapKpiDataToChart;
