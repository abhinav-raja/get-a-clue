import { loadWordList } from "./utils/loadWordList.js";
import randomChoice from "./utils/randomChoice.js";

const wordList = loadWordList();

const zigzags = {
    name: "zigzags",
    label: "Zig Zags",
    desc: "A sequence of words where the last few letters of the first word are the first few letters of the second word, and so on. This relation is cyclic: the last letters of the last word are the first letters of the first word!",
    
    inputs: [
        {label: "Number of words", value: 5},
        {label: "Length of common segment", value: 2}
    ],

    runFunction(inputs){
        const n = inputs[0]
        const blankLen = inputs[1];
        const minWordLen = 2*blankLen + 1;
        const maxWordLen = 3*blankLen + 1;

        const filteredWordList = wordList.filter(el => minWordLen <= el.length && el.length <= maxWordLen);
        const wordsStartingWith = new Map();
        for(const word of filteredWordList){
            if(!wordsStartingWith.has(word.slice(0,blankLen))){
                wordsStartingWith.set(word.slice(0,blankLen), []);
            }
            wordsStartingWith.get(word.slice(0,blankLen)).push(word);
        }

        const resetLimit = 1000;
        let zigZag = [];
        let iterations = 0;
        while(zigZag.length < n){
            iterations++;
            if(iterations > resetLimit){
                iterations = 0;
                zigZag = [];
            }
            if(zigZag.length === 0){
                zigZag.push(randomChoice(filteredWordList));
            } else {
                const pref = zigZag.at(-1).slice(-blankLen);
                if(!wordsStartingWith.has(pref)){
                    zigZag.pop();
                    continue;
                }
                if(zigZag.length === n - 1){
                    const suff = zigZag[0].slice(0, blankLen);
                    const candidates = wordsStartingWith.get(pref).filter(el => el.slice(-blankLen) === suff);
                    if(candidates.length === 0){
                        zigZag.pop();
                    } else {
                        zigZag.push(randomChoice(candidates));
                    }
                } else {
                    zigZag.push(randomChoice(wordsStartingWith.get(pref)));
                }
            }
        }

        const result = [zigZag.map(word => word.slice(0,blankLen).toUpperCase() + word.slice(blankLen, -blankLen) + word.slice(-blankLen).toUpperCase()).join('\n')];
        return result;
    }
};

export default zigzags;