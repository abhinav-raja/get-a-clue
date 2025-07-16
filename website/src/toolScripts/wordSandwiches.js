import { loadFilteredWordList } from "./utils/loadWordList.js";
import randomChoice from "./utils/randomChoice.js";

const filteredWordList = loadFilteredWordList(32);

const wordSandwiches = {
    name: "wordSandwiches",
    label: "Word Sandwiches",
    desc: "A word whose first 3 letters are the same as the last 3 letters! For example: ENTombmENT. There are few such words, so the generator may repeat itself more often.",
    
    inputs: [
        {label: "Number of clues", value: 5}
    ],

    runFunction(inputs){

        const n = inputs[0]
        const results = [];
        for(let i = 0; i < n; i++){
            const word = randomChoice(filteredWordList);
            results.push(`${word.slice(0,3).toUpperCase()}${word.slice(3,-3)}${word.slice(-3).toUpperCase()}`);
        }
        return results;
    }
};

export default wordSandwiches;