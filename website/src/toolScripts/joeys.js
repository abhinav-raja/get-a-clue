import { loadFilteredWordList, loadWordList } from "./utils/loadWordList.js";
import randomChoice from "./utils/randomChoice.js";

const filteredWordList = loadFilteredWordList(128);
const wordSet = new Set(loadWordList().filter(el => el.length > 3));

const joeys = {
    name: "joeys",
    label: "Joeys",
    desc: "Two words, with the second one hidden in the first one as a subsequence! For example, aSToUNd contains stun.",
    
    inputs: [
        {label: "Number of clues", value: 5}
    ],

    runFunction(inputs){

        function findPossibleJoeys(word){
            const n = word.length;
            const res = [];
            for (let i = 1; i < (1 << n) - 1; i++) {
                let joeyCand = "";
                for (let j = 0; j < n; j++) {
                    if ((1 << j) & i) {
                        joeyCand += word[j];
                    }
                }
                if (joeyCand.length < 3) continue;
                if (word.includes(joeyCand)) continue;
                if (wordSet.has(joeyCand)) {
                    res.push(joeyCand);
                }
            }
            return res;
        }

        function formatJoey(word, joey){
            let res = "";
            let ptr = 0;
            for(let i = 0; i < word.length; i++){
                if(ptr < joey.length && word[i] == joey[ptr]){
                    res += word[i].toUpperCase();
                    ptr++;
                } else {
                    res += word[i];
                }
            }
            return res;
        }

        const n = inputs[0]
        const results = [];
        for(let i = 0; i < n; i++){
            let word = "";
            let options = [];
            while(options.length === 0){
                word = randomChoice(filteredWordList);
                options = findPossibleJoeys(word);
            }
            const joey = randomChoice(options);
            const formattedWord = formatJoey(word, joey);
            results.push(`${formattedWord} -> ${joey}`)
        }
        return results;
    }
};

export default joeys;