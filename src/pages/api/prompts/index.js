import createHandler from "next-connect";
import { ObjectId } from "mongodb";
import dbPromise from "@/modules/db";

const handler = createHandler();
export default handler;

handler.get(async (req, res) => {
  const prompts = await getPrompts();
  res.json({ prompts });
});

handler.post(async (req, res) => {
  const { url, text, creator } = JSON.parse(req.body);

  const { insertedId } = await (
    await dbPromise
  )
    .db()
    .collection(`prompts`)
    .insertOne({
      creator: new ObjectId(creator),
      url,
      text,
    });

  res.setHeader("Access-Control-Allow-Origin", "*"); // lock this down later
  res.json({ _id: insertedId });
});

export async function getPrompts() {
  return await (
    await dbPromise
  )
    .db()
    .collection(`prompts`)
    .aggregate([
      {
        $lookup: {
          localField: "creator",
          from: "creators",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ])
    .toArray();
}
