import { User } from "./user";

export type PartnerType = 'solution_provider' | 'training_provider' | 'auditor';

export type ServiceOffering =
  | 'esg_consultation'
  | 'carbon_accounting'
  | 'sustainability_training'
  | 'ehs_auditing'
  | 'sdg_implementation'
  | 'reporting_assurance'
  | 'environmental_compliance'
  | 'social_responsibility'
  | 'governance_advisory';

export interface PartnerProfile {
  id: string;
  organization_name: string;
  gst_number?: string;
  address?: string;
  website?: string;
  services_offered?: string[];
  partner_type: PartnerType;
  profile_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface CaseStudy {
  id: string;
  partner_id: string;
  client_name: string;
  description: string;
  outcome?: string;
  year?: number;
  created_at: string;
  updated_at: string;
}

export interface PartnerUser extends User {
  role: 'partner';
  profile?: PartnerProfile;
  caseStudies?: CaseStudy[];
}
