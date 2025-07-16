import { loadWordList } from "./utils/loadWordList.js";
import randomChoice from "./utils/randomChoice.js";

const wordList = loadWordList();

const wordLadders = {
    name: "wordLadders",
    label: "Word Ladders",
    desc: "A sequence of N+1 words of length N. Each word differs from the previous one by one letter, and the letter in each position can only be changed once. Try it out to see an example! Note that longer ladders may take time to generate.",
    
    inputs: [
        {label: "Length of words (N)", value: 5}
    ],

    runFunction(inputs){
        const n = inputs[0]
        const filteredWordList = wordList.filter(el => el.length === n);
        const wordSet = new Set(filteredWordList);

        //create the word ladder
        let wordLadder = [];
        let remChanges = [];
        for(let i = 0; i < n; i++) remChanges.push(i);
        let attempts = 0;
        while(wordLadder.length < n + 1){
            attempts++;
            if(attempts >= 500){
                wordLadder = [];
                remChanges = [];
                for(let i = 0; i < n; i++) remChanges.push(i);
                attempts = 0;
            }

            if(wordLadder.length === 0){
                wordLadder.push(randomChoice(filteredWordList));
            } else {
                let change = randomChoice(remChanges);
                let candidates = Array(26).fill(wordLadder.at(-1));
                for(let j = 0; j < 26; j++){
                    candidates[j] = candidates[j].slice(0, change) +  String.fromCharCode("a".charCodeAt(0) + j) + candidates[j].slice(change+1);
                }
                
                candidates.splice(candidates.indexOf(wordLadder.at(-1)), 1);
                candidates = candidates.filter(el => wordSet.has(el));
                if(candidates.length === 0){
                    continue;
                } else {
                    wordLadder.push(randomChoice(candidates));
                    remChanges.splice(remChanges.indexOf(change), 1);
                }
            }
        }

        const result = [wordLadder.join('\n')];
        return result;
    }
};

export default wordLadders;