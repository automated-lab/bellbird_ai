alter table "public"."copy_collections" enable row level security;

alter table "public"."external_apps" enable row level security;

alter table "public"."fields" enable row level security;

alter table "public"."generations_copies" enable row level security;

alter table "public"."organizations_usage" enable row level security;

alter table "public"."template_fields" enable row level security;

alter table "public"."templates" enable row level security;

create policy "Enable delete access for members belong to the organization"
on "public"."copy_collections"
as permissive
for delete
to authenticated
using (current_user_is_member_of_organization(organization_id));


create policy "Enable insert access for members belong to the organization"
on "public"."copy_collections"
as permissive
for insert
to authenticated
with check (current_user_is_member_of_organization(organization_id));


create policy "Enable read access for members belong to the organization"
on "public"."copy_collections"
as permissive
for select
to authenticated
using (current_user_is_member_of_organization(organization_id));


create policy "Fields can be read by authenticated users"
on "public"."fields"
as permissive
for select
to authenticated
using (true);


create policy "Enable delete access for members belong to the organization"
on "public"."generations_copies"
as permissive
for delete
to authenticated
using (current_user_is_member_of_organization(organization_id));


create policy "Enable insert access for members belong to the organization"
on "public"."generations_copies"
as permissive
for insert
to authenticated
with check (current_user_is_member_of_organization(organization_id));


create policy "Enable read access for members belong to the organization"
on "public"."generations_copies"
as permissive
for select
to authenticated
using (current_user_is_member_of_organization(organization_id));


create policy "Organization usage can be read only by organization members"
on "public"."organizations_usage"
as permissive
for select
to authenticated
using (current_user_is_member_of_organization(organization_id));


create policy "Fields can be read by authenticated users"
on "public"."template_fields"
as permissive
for select
to authenticated
using (true);


create policy "Templates can be read by all authenticated users"
on "public"."templates"
as permissive
for select
to authenticated
using (true);



