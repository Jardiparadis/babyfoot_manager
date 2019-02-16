CREATE TABLE "Game" (
    "id" serial  PRIMARY KEY NOT NULL,
    "state" boolean NOT NULL,
    "players" text[2],
    "dateCreated" timestamp WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc')
)
