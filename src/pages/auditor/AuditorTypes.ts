
export interface AssignedEnterprise {
  id: string;
  name: string;
  email: string;
  industry: string;
  assignment_id: string;
  assignment_status: string;
}

export interface PendingAudit {
  id: string;
  enterprise_name: string;
  template_title: string;
  audit_date: string;
  status: string;
}

export interface CompletedAudit {
  id: string;
  enterprise_name: string;
  template_title: string;
  audit_date: string;
  completion_date: string;
  total_score: number;
  max_score: number;
}

export interface AuditQuestion {
  id: string;
  question_text: string;
  category: string;
  iso_standard: string;
  weightage: number;
  response?: string;
  score?: number;
  non_conformance_description?: string;
  action_required?: string;
  action_deadline?: string;
  action_status?: string;
  action_taken?: string;
}

export interface EnterpriseAuditDetail {
  id: string;
  enterprise_id: string;
  enterprise_name: string;
  status: string;
  audit_date: string;
  completion_date: string | null;
  template_id: string;
  template_title: string;
  total_score: number | null;
  max_score: number | null;
  notes: string | null;
}
