import { loadWordList } from "./utils/loadWordList.js";
import randomChoice from "./utils/randomChoice.js";
import Trie from './utils/trie.js'

const wordList = loadWordList();

const magicSquares = {
    name: "magicSquares",
    label: "Magic Squares",
    desc: "An NxN square where the word formed by each row is the same as the word formed by the corresponding column! Try it out to see an example.",

    inputs: [
        { label: "Length of each word (N)", value: 5 }
    ],

    runFunction(inputs) {
        const n = inputs[0];

        const filteredWordList = wordList.filter(el => el.length == n);
        const trie = new Trie(filteredWordList);

        let words = [];
        let pref = "";
        while (words.length < n) {
            pref = words.map(el => el[words.length]).join("");
            let newWord = trie.query(pref);
            if(newWord.length === 0){
                words = [];
                pref = "";
            } else {
                words.push(newWord);
            }
        }

        const result = [words.join('\n')];
        return result;
    }
};

export default magicSquares;