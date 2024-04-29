// trackController.js
const jwtUtils = require("../utils/jwtUtils");
const trackService = require("../services/trackService");
const prisma = require("../db/prismaClient");

const getTrack = async (req, res) => {
  const { name, artist, year, img } = req.body;

  const track = await prisma.tracks.findFirst({
    where: {
      track_name: name,
    },
  });

  if (!track) {
    //Get audio stream from YouTube
    const audioStream = await trackService.getAudioFromYTDL(name, artist, year);

    // Stream audio to the client
    res.setHeader("Content-Type", "audio/mpeg");
    audioStream.pipe(res);

    // Upload to Google Drive and get the file ID
    const fileId = await trackService.uploadToDrive("./audio/audio.mp3");

    // Save file ID to Supabase or perform other operations
    const saveTrack = await prisma.tracks.create({
      data: {
        track_name: name,
        track_artist: artist,
        album_img: img,
        track_file: fileId,
        release_year: year,
      },
    });
  } else {
    try {
      const audioData = await trackService.getAudioFromDrive(track.track_file);
      // const audioBlob = new Blob([audioData], { type: "audio/mp3" });
      res.setHeader("Content-Type", "audio/mpeg");

      // Pipe the audio stream to the response
      audioData.pipe(res);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error getting audio from Google Drive" });
    }
  }
};

const updateLastPlayed = async (req, res) => {
  const { token, name } = req.body;
  const { userId } = jwtUtils.verifyToken(token);

  const track = await prisma.tracks.findFirst({
    where: {
      track_name: name,
    },
  });

  if (track) {
    const result = await prisma.model.upsert({
      where: {
        user_id: userId,
      },
      update: {
        track_id: track.track_id,
      },
      create: {
        user_id: userId,
        track_id: track.track_id,
      },
    });
  }
};

const getPlaylistTracks = async (req, res) => {
  const { playlistId } = req.body;

  try {
    const playlistTracks = await prisma.tracks.findMany({
      where: {
        PlayListTracks: {
          some: {
            playlist_id: playlistId,
          },
        },
      },
    });

    return res.json({ playlistTracks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addTrackToPlaylist = async (req, res) => {
  const { playlistId, track_name } = req.body;

  try {
    const track = await prisma.tracks.findFirst({
      where: {
        track_name: track_name,
      },
    });

    if (!track) {
      res.json({
        message:
          "The song is currently not with us. Please play the song once and wait for it complete and then add it to your playlist",
      });
      return;
    }

    const playlistTrack = await prisma.playListTracks.findFirst({
      where: {
        playlist_id: playlistId,
        track_id: track.track_id,
      },
    });

    if (playlistTrack) {
      res.json({ message: "Track already exists in the playlist" });
      return;
    }

    const insert = await prisma.playListTracks.create({
      data: {
        track_id: track.track_id,
        playlist_id: playlistId,
      },
    });
    res.json({ message: "Successfully added to playlist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const removeFromPlaylist = async (req, res) => {
  const { playlistId, trackId } = req.body;

  try {
    const remove = await prisma.playListTracks.delete({
      where: {
        playlist_id: playlistId,
        track_id: trackId,
      },
    });
    res.json({ message: "Successfully deleted from playlist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getTrack,
  addTrackToPlaylist,
  getPlaylistTracks,
  updateLastPlayed,
  removeFromPlaylist,
};
