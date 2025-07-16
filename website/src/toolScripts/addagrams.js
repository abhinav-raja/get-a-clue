import { loadWordList } from "./utils/loadWordList.js";
import randomChoice from "./utils/randomChoice.js";
import { data as vectorAdj } from './data/vectorAdj.js';
import { data as vectorsToWords } from './data/vectorsToWords.js';

const wordList = loadWordList();

const addagrams = {
    name: "addagrams",
    label: "Addagrams",
    desc: "A sequence of words, where each one is made by anagramming the previous word and adding an extra letter in. For example: at, ate, peat, taper, repeat.",

    inputs: [
        { label: "Length of first word", value: 2 },
        { label: "number of words", value: 5 }
    ],

    runFunction(inputs) {

        //Convert a word into a frequency vector of characters
        function wordToFreqVec(word) {
            const vec = Array(26).fill(0);
            const lower = word.toLowerCase();
            for (const char of lower) {
                const code = char.charCodeAt(0);
                if (code >= 97 && code <= 122) {
                    vec[code - 97]++;
                }
            }
            return vec;
        }

        //Polynomial rolling hash for frequency vectors
        function hashFreqVector(vec) {
            const base = 31;
            const mod = 1_000_000_007;
            let hash = 0;
            for (let i = 0; i < vec.length; i++) {
                hash = (hash * base + vec[i]) % mod;
            }
            return hash;
        }

        const startLen = inputs[0];
        const n = inputs[1];
        let vectors = [];
        const maxAttempts = 1000;
        let attempts = 0;
        
        while(vectors.length < n){
            attempts++;
            if(attempts >= maxAttempts){
                attempts = 0;
                vectors = [];
            }

            if(vectors.length === 0){
                let startWord = randomChoice(wordList.filter(el => el.length === startLen));
                let startVector = wordToFreqVec(startWord);
                vectors.push(startVector);
            } else {
                if(vectorAdj[String(hashFreqVector(vectors.at(-1)))].length === 0){
                    vectors.pop();
                } else {
                    let nextVectorHash = randomChoice(vectorAdj[String(hashFreqVector(vectors.at(-1)))]);
                    for (let i = 0; i < 26; i++) {
                        //Generate a candidate neighbor by adding a letter
                        const cand = [...vectors.at(-1)];
                        cand[i]++;
                        const candKey = hashFreqVector(cand);
                        if(candKey === nextVectorHash){
                            vectors.push(cand);
                            break;
                        }
                    }
                }
            }
        }

        const words = [];
        for(let vector of vectors){
            const key = hashFreqVector(vector);
            const word = randomChoice(vectorsToWords.get(String(key)));
            words.push(word);
        }
        
        const results = [
            words.join('\n')
        ];

        return results;
    }
};

export default addagrams;