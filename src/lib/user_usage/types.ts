export interface IOrganizationUsage {
  organization_id: number;
  tokens_generated: number;
  tokens_limit: number;
  created_at?: string;
}
