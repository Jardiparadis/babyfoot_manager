create table  "Games" (
    "id" serial  primary key not null,
    "state" boolean not null,
    "players" text[2]
)