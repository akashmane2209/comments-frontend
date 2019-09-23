import User from "../models/user";

export const login = async (req, res) => {
  console.log(req.body);
  const { name } = req.body;
  const user = await User.findOne({ name: name }).exec();
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "Not Found" });
  }
};
