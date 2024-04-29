-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_pic" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Tracks" (
    "track_id" SERIAL NOT NULL,
    "track_name" TEXT NOT NULL,
    "track_artist" TEXT NOT NULL,
    "album_img" TEXT NOT NULL,
    "track_file" TEXT NOT NULL,
    "release_year" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,

    CONSTRAINT "Tracks_pkey" PRIMARY KEY ("track_id")
);

-- CreateTable
CREATE TABLE "LastPlayed" (
    "last_played_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "track_id" INTEGER NOT NULL,

    CONSTRAINT "LastPlayed_pkey" PRIMARY KEY ("last_played_id")
);

-- CreateTable
CREATE TABLE "PlayList" (
    "playlist_id" SERIAL NOT NULL,
    "playlist_name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "PlayList_pkey" PRIMARY KEY ("playlist_id")
);

-- CreateTable
CREATE TABLE "PlayListTracks" (
    "playlist_track_id" SERIAL NOT NULL,
    "track_id" INTEGER NOT NULL,
    "playlist_id" INTEGER NOT NULL,

    CONSTRAINT "PlayListTracks_pkey" PRIMARY KEY ("playlist_track_id")
);

-- AddForeignKey
ALTER TABLE "LastPlayed" ADD CONSTRAINT "LastPlayed_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LastPlayed" ADD CONSTRAINT "LastPlayed_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "Tracks"("track_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayList" ADD CONSTRAINT "PlayList_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayListTracks" ADD CONSTRAINT "PlayListTracks_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "Tracks"("track_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayListTracks" ADD CONSTRAINT "PlayListTracks_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "PlayList"("playlist_id") ON DELETE RESTRICT ON UPDATE CASCADE;
