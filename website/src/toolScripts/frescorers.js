import { loadWordList } from "./utils/loadWordList.js";
import randomChoice from "./utils/randomChoice.js";
import Trie from './utils/trie.js'

const filteredWordList = loadWordList().filter(x => 5 <= x.length && x.length <= 7);
const trie = new Trie(filteredWordList);

const frescorers = {
    name: "frescorers",
    label: "Frescorers",
    desc: "Two words: the last 3 letters of the first one are the first 3 letters of the second one! For example, freSCO and SCOrer.",

    inputs: [
        {label: "Number of clues", value: 5}
    ],

    runFunction(inputs){
        const n = inputs[0];
        const results = [];
        for(let i = 0; i < n; i++){
            while(true){
                const word1 = randomChoice(filteredWordList);
                const word2 = trie.query(word1.slice(-3));
                if(word2.length > 0){
                    results.push(`${word1.slice(0, -3)}${word1.slice(-3).toUpperCase()}${word2.slice(3)}`);
                    break;
                }
            }
        }
        return results;
    }
};

export default frescorers;