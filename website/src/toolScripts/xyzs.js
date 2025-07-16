import { loadWordList } from "./utils/loadWordList.js";
import randomChoice from "./utils/randomChoice.js";

const wordList = loadWordList();

const xyzs = {
    name: "xyzs",
    label: "XYZs",
    desc: "A sequence of words where the first 3 letters of the first word are the same as the 2nd to 4th letters of the second word, are the same as the 3rd to 5th letters of the third word, and so on. Try it out to see an example!",
    
    inputs: [
        {label: "Number of words", value: 5}
    ],

    runFunction(inputs){

        const n = inputs[0]
        const wordLen = n + 2;
        const filteredWordList = wordList.filter(el => el.length === wordLen);
        const xyzMasks = new Map();
        for(let posn = 0; posn < n; posn++){
            let bit = 1<<posn;
            for(const word of filteredWordList){
                const subs = word.slice(posn, posn + 3);
                let prev = 0;
                if(xyzMasks.has(subs)) prev = xyzMasks.get(subs);
                xyzMasks.set(subs, prev | bit);
            }
        }
        const targetMask = (1<<n)-1;
        const validXyzs = [];
        for(const [xyz, mask] of xyzMasks){
            if(mask === targetMask) validXyzs.push(xyz);
        }
        const xyz = randomChoice(validXyzs);
        const options = [];
        for(let i = 0; i < n; i++){
            options.push([]);
        }
        for(const word of filteredWordList){
            for(let posn = 0; posn < n; posn++){
                if(word.slice(posn, posn + 3) === xyz){
                    options[posn].push(word);
                }
            }
        }
        const words = options.map(el => randomChoice(el));
        for(let i = 0; i < n; i++){
            words[i] = words[i].slice(0, i) + words[i].slice(i, i + 3).toUpperCase() + words[i].slice(i+3);
        }
        const result = [words.join('\n')];
        return result;
    }
};

export default xyzs;