import { loadFilteredWordList } from "./utils/loadWordList.js";
import randomChoice from "./utils/randomChoice.js";
import { data as borderMap } from './data/borderMap.js';

const filteredWordList = loadFilteredWordList(1);

const borderlands = {
    name: "borderlands",
    label: "Borderlands",
    desc: "Two words such that their first and last letters taken together spell out another word. For example: MiddlE EasT gives MEET.",
    
    inputs: [
        {label: "Number of clues", value: 5}
    ],

    runFunction(inputs){

        function capitaliseBorders(word){
            return word[0].toUpperCase() + word.slice(1, -1) + word.at(-1).toUpperCase();
        }

        const n = inputs[0]
        const results = [];
        for(let i = 0; i < n; i++){
            const word = randomChoice(filteredWordList);
            const border1 = word.slice(0, 2);
            const border2 = word.slice(2, 4);
            const word1 = randomChoice(borderMap.get(border1));
            const word2 = randomChoice(borderMap.get(border2));
            results.push(
                word + " -> " + capitaliseBorders(word1) + " " + capitaliseBorders(word2) 
            );
        }
        return results;
    }
};

export default borderlands;