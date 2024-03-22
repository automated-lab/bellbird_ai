alter table "public"."templates" add column "maxConcurrentGenerations" bigint not null default '5'::bigint;


