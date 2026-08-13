import { getAllMessagesWithAuthors } from "../models/messagesModel.js";

const getHome = async (req, res) => {
  try {
    const messages = await getAllMessagesWithAuthors();

    res.render("index", { messages, user: req.user || null });
  } catch (error) {
    console.log("Error fetching Messages", error);
    res.status(500).send("Error fetching Messages");
  }
};

export default getHome;
