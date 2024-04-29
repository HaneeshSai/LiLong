// userService.js
const prisma = require("../db/prismaClient");
const jwtUtils = require("../utils/jwtUtils");

const getUsersPlaylists = async (token) => {
  try {
    const { userId } = jwtUtils.verifyToken(token);

    const playlists = await prisma.playList.findMany({
      where: {
        user_id: userId,
      },
    });

    const LastPlayed = await prisma.lastPlayed.findMany({
      where: {
        user_id: userId,
      },
    });

    return { playlists, LastPlayed };
  } catch (e) {
    console.error("Unexpected error:", e);
    throw new Error("Internal Server Error");
  }
};

const createPlaylist = async (token, name, author, img) => {
  try {
    const { userId } = jwtUtils.verifyToken(token);

    const insertRow = await prisma.playList.create({
      data: {
        playlist_name: name,
        user_id: userId,
        author: author,
        img: img,
      },
    });

    return "Succesfully created Playlist";
  } catch (error) {
    console.error("Unexpected error:", error);
    throw new Error("Internal Server Error");
  }
};

module.exports = {
  getUsersPlaylists,
  createPlaylist,
};
