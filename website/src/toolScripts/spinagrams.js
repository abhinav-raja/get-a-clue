import { loadFilteredWordList } from "./utils/loadWordList.js";
import randomChoice from "./utils/randomChoice.js";

const filteredWordList = loadFilteredWordList(16);

const spinagrams = {
    name: "spinagrams",
    label: "Spinagrams",
    desc: "Two words: the second is obtained by rotating the first word to the left! For example, SOIL and OILS.",
    
    inputs: [
        {label: "Number of clues", value: 5}
    ],

    runFunction(inputs){

        function rotate(word) {
            return word.slice(1) + word[0];
        }

        const n = inputs[0]
        const results = [];
        for(let i = 0; i < n; i++){
            const word = randomChoice(filteredWordList);
            const word2 = rotate(word);
            results.push(`${word} ${word2}`);
        }
        return results;
    }
};

export default spinagrams;