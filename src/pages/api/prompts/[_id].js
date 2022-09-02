import createHandler from "next-connect";
import { ObjectId } from "mongodb";
import dbPromise from "@/modules/db";

const handler = createHandler();
export default handler;

handler.get(async (req, res) => {
  res.json({ prompt: await getPrompt(req.query._id) });
});

handler.put(async (req, res) => {
  const { creator, url, text } = JSON.parse(req.body);
  const { upsertedId } = await (
    await dbPromise
  )
    .db()
    .collection(`prompts`)
    .updateOne(
      { _id: ObjectId(req.query._id) },
      {
        $set: {
          creator: new ObjectId(creator),
          url,
          text,
        },
      }
    );
  res.json({ _id: upsertedId });
});

export async function getPrompt(_id) {
  const prompts = await (
    await dbPromise
  )
    .db()
    .collection(`prompts`)
    .aggregate([
      {
        $match: { _id: ObjectId(_id) },
      },
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

  return {
    ...prompts[0],
    creator: {
      ...prompts[0].creator[0],
    },
  };
}
