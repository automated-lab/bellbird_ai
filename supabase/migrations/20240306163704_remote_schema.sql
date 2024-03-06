drop function if exists "public"."get_user_id_by_email"(email text);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_id_by_email(email text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    uid uuid;
BEGIN
    SELECT id INTO uid FROM auth.users au WHERE au.email = get_user_id_by_email.email LIMIT 1;
    RETURN uid;
END;
$function$
;


