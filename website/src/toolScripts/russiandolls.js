import { loadFilteredWordList, loadWordList } from "./utils/loadWordList.js";
import randomChoice from "./utils/randomChoice.js";

const filteredWordList = loadFilteredWordList(8);
const wordSet = new Set(loadWordList());

const russianDolls = {
    name: "russianDolls",
    label: "Russian Dolls",
    desc: "Two words: inserting the first one into the second one gives you a third word! For example: RIMS -> CON = cRIMSon",

    inputs: [
        { label: "Number of clues", value: 5 }
    ],

    runFunction(inputs) {
        const n = inputs[0];
        const results = [];
        for (let i = 0; i < n; i++) {
            while (true) {
                const word = randomChoice(filteredWordList);
                const m = word.length;
                const options = [];
                //Starting index of inner word
                for (let i = 1; i <= m - 2; i++) {
                    //Ending index of inner word
                    for (let j = i + 1; j <= m - 2; j++) {
                        const word1 = word.slice(0, i) + word.slice(j + 1);
                        const word2 = word.slice(i, j + 1);
                        if (wordSet.has(word1) && wordSet.has(word2)) {
                            options.push([word1, word2]);
                        }
                    }
                }
                if(options.length > 0){
                    const chosen = randomChoice(options);
                    const word1 = chosen[0];
                    const word2 = chosen[1];
                    results.push(`${word2} -> ${word1} = ${word}`);
                    break;
                }
            }
        }
        return results;
    }
};

export default russianDolls;