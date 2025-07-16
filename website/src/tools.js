import borderlands from "./toolScripts/borderlands.js";
import charades from "./toolScripts/charades.js";
import frescorers from "./toolScripts/frescorers.js";
import spinagrams from "./toolScripts/spinagrams.js";
import telescopics from "./toolScripts/telescopics.js";
import addagrams from "./toolScripts/addagrams.js";
import joeys from "./toolScripts/joeys.js";
import magicSquares from "./toolScripts/magicSquare.js";
import rotagrams from "./toolScripts/rotagrams.js";
import russianDolls from "./toolScripts/russiandolls.js";
import spoonerisms from "./toolScripts/spoonerisms.js";
import wordLadders from "./toolScripts/wordLadder.js";
import wordSandwiches from "./toolScripts/wordSandwiches.js";
import xyzs from "./toolScripts/xyzs.js";
import zigzags from "./toolScripts/zigzags.js";

export const tools = [
  addagrams,
  borderlands,
  charades,
  frescorers,
  joeys,
  magicSquares,
  rotagrams,
  russianDolls,
  spinagrams,
  spoonerisms,
  telescopics,
  wordLadders,
  wordSandwiches,
  xyzs,
  zigzags
]

export const toolInfo = tools.map(el => ({ name: el.name, label: el.label, desc: el.desc }));

