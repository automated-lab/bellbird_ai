create policy "Organization usage can be updated only by organization members"
on "public"."organizations_usage"
as permissive
for update
to authenticated
using (current_user_is_member_of_organization(organization_id))
with check (current_user_is_member_of_organization(organization_id));



