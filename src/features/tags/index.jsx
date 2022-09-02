import { useState } from "react";
import ArtistTag from "./artist";
import BaseTag from "./base";
import CameraTag from "./camera";
import StyleTag from "./style";

const delimiters = /[,\-\+]/;

export default function Tags({ commands, prompts, camera, styles }) {
  const [raw, setRaw] = useState("");
  const [_prompts, setPrompts] = useState(prompts);
  const [_commands, setCommands] = useState(commands);

  function extract() {
    const cmdIndex = raw.indexOf("--");
    setPrompts(
      [...new Set(raw.slice(0, cmdIndex - 1).split(delimiters))].map((p) =>
        p.trim()
      )
    );
    setCommands(
      [...new Set(raw.slice(cmdIndex, raw.length).split(" "))].map((p) =>
        p.trim()
      )
    );
  }

  function isArtist(tag) {
    return tag.split(" ")[0].toLowerCase().trim() === "by";
  }

  return (
    <div className="mt-16 container w-1/2 mx-auto">
      <div className="w-full flex flex-col gap-4">
        <div>
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className="w-full border bg-gray-800 text-white font-thin min-h-[120px] outline-none"
          />
        </div>
        <div>
          <button
            onClick={extract}
            className="w-full border py-2 px-8 text-xl font-black text-white bg-blue-600 shadow drop-shadow-lg">
            extract!
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center flex-wrap gap-2 my-4">
        {_prompts.map((prompt) => {
          if (isArtist(prompt)) return <ArtistTag>{prompt}</ArtistTag>;
          if (styles.indexOf(prompt) > -1) return <StyleTag>{prompt}</StyleTag>;
          if (camera.indexOf(prompt) > -1)
            return <CameraTag>{prompt}</CameraTag>;

          return <BaseTag>{prompt}</BaseTag>;
        })}
      </div>
    </div>
  );
}
