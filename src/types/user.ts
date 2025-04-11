
export type UserRole = 
  | 'fandoro_admin' 
  | 'enterprise' 
  | 'investor' 
  | 'supplier' 
  | 'partner' 
  | 'employee';

export type RevenueRange = 
  | 'upto_1_crore'
  | '1_to_10_crores'
  | '11_to_50_crores'
  | '51_plus_crores';

export type InvestmentRound = 
  | 'seed'
  | 'pre_series_a'
  | 'series_a'
  | 'series_b_plus';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  organization?: string;
  phoneNumber?: string;
}

export interface EnterpriseUser extends User {
  role: 'enterprise';
  revenueRange: RevenueRange;
  investmentRound?: InvestmentRound;
  industries?: string[];
  platformType?: 'esg_due_diligence' | 'complete_platform';
}

export interface EmployeeUser extends User {
  role: 'employee';
  enterpriseId: string;
  designation?: string;
  department?: string;
  gender?: string;
}

export interface FandoroAdmin extends User {
  role: 'fandoro_admin';
}
