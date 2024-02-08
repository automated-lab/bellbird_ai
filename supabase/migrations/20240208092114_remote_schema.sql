drop function if exists "public"."enroll_user_with_new_org"(org_name text, user_id text, create_user boolean);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.enroll_user_with_new_org(org_name text, user_id uuid, create_user boolean DEFAULT true)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  organization bigint;
  uid uuid;
begin
  insert into organizations(
    "name")
  values (
    org_name)
returning
  id,
  uuid into organization,
  uid;

  if create_user then
    insert into users(
      id,
      onboarded)
    values (
      user_id,
      true);
  end if;
  insert into memberships(
    user_id,
    organization_id,
    role)
  values (
    user_id,
    organization,
    2);
  return uid;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.read_id(v_secret text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_id text;
begin
  if current_setting('role') != 'service_role' then
    raise exception 'authentication required';
  end if;
 
  select id from vault.decrypted_secrets where decrypted_secret =
  v_secret into v_id;
  return v_id;
end;
$function$
;


