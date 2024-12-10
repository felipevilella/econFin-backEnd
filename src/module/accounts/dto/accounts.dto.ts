export interface createAccounts {
  total: string;
  userId: string;
  securityKey: string;
  estimatedTotal: string;
  securityKeyEstimated?: string;
}

export interface AccountDto {
  id: string;
  total: string;
  estimatedTotal?: string;
  userId: string;
  securityKey: string;
  securityKeyEstimated?: string;
}

export interface updateAccountDTO {
  total: string;
  estimatedTotal?: string;
  securityKey: string;
  securityKeyEstimated?: string;
}

export interface IAccountMapper {
  total: number;
  estimatedTotal: number;
}
