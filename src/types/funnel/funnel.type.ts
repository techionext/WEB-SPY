export type IFunnelSummary = {
  type: string;
  count: number;
};

export namespace IFunnelSummaryGetDTO {
  export type Args = {
    startDate: string;
    endDate: string;
    campaigns?: string[];
  };
  export type Result = IFunnelSummary[];
}
