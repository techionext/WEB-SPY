export type IMarketingSummary = {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  roi: number;
  roas: number;
  cpa: number;
  ctr: number;
  cpc: number;
  cpm: number;
};

export type IMarketingCampaignRanking = {
  id: string;
  title: string;
  profit: number;
};

export namespace IMarketingSummaryGetDTO {
  export type Args = {
    startDate: string;
    endDate: string;
  };
  export type Result = IMarketingSummary;
}

export namespace IMarketingCampaignRankingGetDTO {
  export type Args = {
    startDate: string;
    endDate: string;
  };
  export type Result = {
    data: IMarketingCampaignRanking[];
  };
}
