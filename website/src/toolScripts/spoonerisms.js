import { loadFilteredWordList } from "./utils/loadWordList.js";
import randomChoice from "./utils/randomChoice.js";
import { data as pronounciationMap} from './data/pronounciationMap.js';
import { data as reversePronounciationMap } from './data/reversePronounciationMap.js';
import { data as rootsForStem } from './data/rootsForStem.js';
import { data as stemsForRoot } from './data/stemsForRoot.js';

const filteredWordList = loadFilteredWordList(64);
//Reconvert rootsForStem and stemsForRoot elements to sets
rootsForStem.forEach((value, key)=>{
    rootsForStem.set(key, new Set(value));
});
stemsForRoot.forEach((value, key)=>{
    stemsForRoot.set(key, new Set(value));
});

const spoonerisms = {
    name: "spoonerisms",
    label: "Spoonerisms",
    desc: "Two phrases of two words each: the second phrase is obtained by swapping the first consonant sounds of the words of the first phrase! For example, Blushing Crow and Crushing Blow.",

    inputs: [
        { label: "Number of clues", value: 5 }
    ],

    runFunction(inputs) {

        //Functions to get phone array and count syllables
        function wordToPhones(word) {
            return pronounciationMap.get(word);
        }
        function countSyllables(phones) {
            return phones.filter(el => !isNaN(el.at(-1))).length;
        }


        //Functions to split a word for spoonerisms
        function getFirstConsonantSound(word) {
            const phones = wordToPhones(word);
            //hacky way to find first vowel sound since cmu always attaches an integer indicating stress to vowel sounds
            const idx = phones.findIndex(el => !isNaN(el.at(-1)));
            if (idx <= 0) {
                return [];
            }
            return phones.slice(0, idx);
        }
        function splitWord(word) {
            const phones = wordToPhones(word);
            const consPrefix = getFirstConsonantSound(word);
            const remPhones = phones.slice(consPrefix.length);
            return [consPrefix, remPhones];
        }

        //set.intersection doesn't work for some reason, so handwritten:    
        function setIntersect(set1, set2) {
            const res = new Set();
            if (set2.length < set1.length) {
                for (const el of set2) {
                    if (set1.has(el)) {
                        res.add(el);
                    }
                }
            } else {
                for (const el of set1) {
                    if (set2.has(el)) {
                        res.add(el);
                    }
                }
            }
            return res;
        }

        const n = inputs[0]
        const results = [];

        for (let i = 0; i < n; i++) {
            const word = randomChoice(filteredWordList);
            let rs1 = splitWord(word);
            let root1 = rs1[0].join('');
            let stem1 = rs1[1].join('');
            const options = [];
            for (const stem2 of stemsForRoot.get(root1)) {
                if (stem2 === stem1) {
                    continue;
                }
                const candidateRoot2s = setIntersect(rootsForStem.get(stem2), rootsForStem.get(stem1));
                for (const root2 of candidateRoot2s) {
                    if (root2 === root1) {
                        continue;
                    }
                    const word2 = randomChoice(reversePronounciationMap.get(root2 + stem2));
                    const word3 = randomChoice(reversePronounciationMap.get(root2 + stem1));
                    const word4 = randomChoice(reversePronounciationMap.get(root1 + stem2));
                    if (word3 === word || word4 === word2) {
                        continue;
                    }

                    options.push([word2, word3, word4]);
                }
            }
            if(options.length === 0){
                i--;
                continue;
            }
            let choice = randomChoice(options);
            const word2 = choice[0];
            const word3 = choice[1];
            const word4 = choice[2];
            results.push(`${word} ${word2} <-> ${word3} ${word4}`)
        }

        return results;
    }
};

export default spoonerisms;