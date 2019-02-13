create table "Games" (
    "id" serial  primary key not null,
    "state" boolean not null,
    "players" text[2],
    "dateCreated" timestamp with time zone not null default (now() at time zone 'utc')
)