export interface Usage {
    currentSuscription: CurrentSuscription;
    usageStatistics:    UsageStatistic[];
    usagePercentage: number;
}

export interface CurrentSuscription {
    suscriptionId:     string;
    cash:              number;
    expirationDate:    Date;
    totalInputTokens:  string;
    totalOutputTokens: string;
    totalUsagePrice:   number;
}

export interface UsageStatistic {
    service_id:        string;
    name:              string;
    totalInputTokens:  string;
    totalOutputTokens: string;
    totalUsagePrice:   number;
}
