import { loadFilteredWordList, loadWordList } from "./utils/loadWordList.js";
import randomChoice from "./utils/randomChoice.js";
import Trie from './utils/trie.js'

const filteredWordList = loadFilteredWordList(4);
const prefTrie = new Trie(loadWordList());
const suffTrie = new Trie(loadWordList().map(el => el.split("").reverse().join("")));

const telescopics = {
    name: "telescopics",
    label: "Telescopics",
    desc: "Two words that hide a third word among them! For example: ap(PLAUD ITS)elf.",
    
    inputs: [
        {label: "Number of clues", value: 5}
    ],

    runFunction(inputs){
        const n = inputs[0]
        const results = [];
        for(let i = 0; i < n; i++){
            const word = randomChoice(filteredWordList);
            const options = [];
            for (let j = 1; j <= word.length - 2; j++) {
                const pref = word.slice(0, j);
                const suff = word.slice(j);
                if (suffTrie.isValidPrefix(pref.split("").reverse().join("")) && prefTrie.isValidPrefix(suff)) {
                    const word1 = suffTrie.query(pref.split("").reverse().join("")).split("").reverse().join("");
                    const word2 = prefTrie.query(suff);
                    options.push([word1.slice(0, -pref.length), pref, suff, word2.slice(suff.length)]);
                }
            }
            if(options.length == 0){
                i--;
                continue;
            }
            const chosen = randomChoice(options);
            const pref1 = chosen[0];
            const prefAns = chosen[1];
            const suffAns = chosen[2];
            const suff2 = chosen[3];
            results.push(`${pref1}(${prefAns.toUpperCase()} ${suffAns.toUpperCase()})${suff2}`);
        }
        return results;
    }
};

export default telescopics;