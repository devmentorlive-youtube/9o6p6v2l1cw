import { getCommands } from "@/api/commands";
import { getPrompts } from "@/api/prompts";

import TagManager from "@/features/tags";
import dbPromise from "@/modules/db";

export default function Homepage(props) {
  return <TagManager {...props} />;
}

export async function getServerSideProps(ctx) {
  const { styles, camera } = (
    await (await dbPromise).db().collection("settings").find({}).toArray()
  )[0];

  return {
    props: {
      prompts: await getPrompts(),
      commands: await getCommands(),
      styles,
      camera,
    },
  };
}
