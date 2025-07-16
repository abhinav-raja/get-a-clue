import { loadFilteredWordList, loadWordList } from "./utils/loadWordList.js";
import randomChoice from "./utils/randomChoice.js";

const filteredWordList = loadFilteredWordList(2);
const wordSet = new Set(loadWordList());

const charades = {
    name: "charades",
    label: "Charades",
    desc: "Two words that give another word when put together! For example: act + ion = action.",

    inputs: [
        {label: "Number of clues", value: 5}
    ],

    runFunction(inputs){
        const n = inputs[0];
        const results = [];
        for(let i = 0; i < n; i++){
            const ans = randomChoice(filteredWordList);
            const m = ans.length;
            const splitOptions = [];
            for(let j = 3; j <= m - 3; j++){
                const word1 = ans.slice(0, j);
                const word2 = ans.slice(j);
                if(wordSet.has(word1) && wordSet.has(word2)){
                    splitOptions.push([word1, word2]);
                }
            }
            if(splitOptions.length == 0){
                i--;
                continue;
            }
            const split = randomChoice(splitOptions);
            const word1 = split[0];
            const word2 = split[1];
            results.push(`${word1} + ${word2} = ${ans}`);
        }
        return results;
    }
};

export default charades;