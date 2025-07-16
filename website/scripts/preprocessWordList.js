import fs from 'fs';
import path from 'path';
import CMUDict from 'cmudict';
import Trie from '../src/toolScripts/utils/trie.js'

let dictFilePath = path.resolve('src', 'assets', 'dict.txt');
let outFolder = path.resolve('src', 'toolScripts', 'data');
let outFilePath = path.resolve(outFolder, 'wordList.txt');
let outFilePath2 = path.resolve(outFolder, 'wordList.js');

//read the word list
const absolutePath = path.resolve(dictFilePath);
const data = fs.readFileSync(absolutePath, 'utf-8');
const words = data
    .split(/\r?\n/)
    .map(line => line.trim().toLowerCase().replace(/[^a-z]/g, ''))
    .filter(line => line.length > 0);

//8 bit binary masks for each word, indivating possible clue types
const wordMasks = new Map();
for (let word of words) {
    wordMasks.set(word, 0);
}
//mapping of clue types to bits
const clueTypeBit = {
    borderlands: 1,
    charades: 2,
    telescopics: 4,
    russian_dolls: 8,
    spinagrams: 16,
    word_sandwiches: 32,
    spoonerisms: 64,
    joeys: 128
};

//Preprocessing all clue types
preprocessBorderlands();
preprocessCharades();
preprocessTelescopics();
preprocessRussianDolls();
preprocessSpinagrams();
preprocessWordSandwiches();
preprocessAddagrams();
preprocessSpoonerisms();
preprocessJoeys();
//Save the dictionary with masks
const lines = words.map(word => `${word} ${wordMasks.get(word)}`);
fs.writeFileSync(outFilePath, lines.join("\n"));
saveMap(wordMasks, outFilePath2);

//BORDERLANDS
function preprocessBorderlands() {
    //Create map of borders to words
    const borderMap = new Map();
    for (let word of words) {
        if (word.length >= 2) {
            let border = word[0] + word.at(-1);
            if (!borderMap.has(border)) borderMap.set(border, []);
            borderMap.get(border).push(word);
        }
    }
    //Find which words can be possible borderlands answers
    for (const word of words) {
        if (word.length === 4) {
            let border1 = word.substring(0, 2);
            let border2 = word.substring(2, 4);
            if (borderMap.has(border1) && borderMap.has(border2)) {
                wordMasks.set(word, wordMasks.get(word) | clueTypeBit['borderlands']);
            }
        }
    }
    //Save border map
    saveMap(borderMap, path.resolve(outFolder, 'borderMap.js'));

    console.log("Borderlands done!");
}

//CHARADES
function preprocessCharades() {
    //Make Tries
    const prefTrie = new Trie(words);
    const suffTrie = new Trie(words.map(word => word.split("").reverse().join("")));
    for (const word of words) {
        if (word.length < 6) continue;
        //Find valid prefixes and suffixes
        const prefValidity = prefTrie.prefixValidity(word);
        const reversedWord = word.split("").reverse().join("");
        let suffValidity = suffTrie.prefixValidity(reversedWord);
        suffValidity = suffValidity.reverse();
        //If a valid break point is found, mark this word as charadable
        for (let i = 3; i <= word.length - 3; i++) {
            if (prefValidity[i - 1] && suffValidity[i - 1]) {
                wordMasks.set(word, wordMasks.get(word) | clueTypeBit.charades);
                break;
            }
        }
    }

    console.log("Charades done!");
}

//TELESCOPICS
function preprocessTelescopics() {
    const prefTrie = new Trie(words);
    const suffTrie = new Trie(words.map(word => word.split("").reverse().join("")));

    // Find which words can be telescopics answers
    for (const word of words) {
        for (let i = 1; i <= word.length - 2; i++) {
            const pref = word.slice(0, i);
            const suff = word.slice(i);
            // Check that there exists a word with suffix = pref and a word with prefix = suff
            if (suffTrie.isValidPrefix(pref.split("").reverse().join("")) && prefTrie.isValidPrefix(suff)) {
                const prev = wordMasks.get(word) || 0;
                wordMasks.set(word, prev | clueTypeBit.telescopics);
                break;
            }
        }
    }

    console.log("Telescopics done!");
}

//RUSSIAN DOLLS
function preprocessRussianDolls() {
    const wordSet = new Set(words);

    // Find all words which can be russian dolls
    for (const word of words) {
        const n = word.length;
        let found = false;
        //Starting index of inner word
        for (let i = 1; i <= n - 2; i++) {
            //Ending index of inner word
            for (let j = i + 1; j <= n - 2; j++) {
                const word1 = word.slice(0, i) + word.slice(j + 1);
                const word2 = word.slice(i, j + 1);
                if (wordSet.has(word1) && wordSet.has(word2)) {
                    const prev = wordMasks.get(word) || 0;
                    wordMasks.set(word, prev | clueTypeBit.russian_dolls);
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
    }

    console.log("Russian Dolls done!");
}

//SPINAGRAMS
function preprocessSpinagrams() {
    const wordSet = new Set(words);

    // Rotates a word
    function rotate(word) {
        return word.slice(1) + word[0];
    }

    // Find which words can be possible spinagrams
    for (const word of words) {
        if (word.length < 2) continue;
        if (wordSet.has(rotate(word))) {
            const prev = wordMasks.get(word) || 0;
            wordMasks.set(word, prev | clueTypeBit.spinagrams);
        }
    }
    console.log("Spinagrams done!");
}

//WORD SANDWICHES
function preprocessWordSandwiches() {
    for (const word of words) {
        if (word.length < 6) continue;
        if (word.slice(0, 3) === word.slice(-3)) {
            const prev = wordMasks.get(word) || 0;
            wordMasks.set(word, prev | clueTypeBit.word_sandwiches);
        }
    }
    console.log("Word sandwiches done!");
}

//ADDAGRAMS
function preprocessAddagrams() {
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

    //Set of all possible freq vectors
    const vectors = new Set();
    //Store anagrams together (words with same frequency vector)
    const vectorsToWords = new Map(); 
    for (const word of words) {
        const vec = wordToFreqVec(word);
        vectors.add(vec);
        const key = hashFreqVector(vec);
        if (!vectorsToWords.has(key)) {
            vectorsToWords.set(key, []);
        }
        vectorsToWords.get(key).push(word);
    }

    //Create an adjacency list on these frequency vectors
    const vectorAdj = {};
    for (const vector of vectors) {
        const key = hashFreqVector(vector);
        vectorAdj[key] = [];
        for (let i = 0; i < 26; i++) {
            //Generate a candidate neighbor by adding a letter
            const cand = [...vector];
            cand[i]++;
            const candKey = hashFreqVector(cand);
            //If the neighbor exists, add it to adjacency list
            if (vectorsToWords.has(candKey)) {
                vectorAdj[key].push(candKey);
            }
        }
    }

    //Save both the adjacency and vector to word mapping as jsons
    saveObj(vectorAdj, path.join(outFolder, "vectorAdj.js"));
    saveMap(vectorsToWords, path.join(outFolder, "vectorsToWords.js"));

    console.log("Addagrams done!");
}

//SPOONERISMS
function preprocessSpoonerisms(){
    //Prepare CMU Pronouncing dictionary
    const cmu = new CMUDict.CMUDict();
    //Functions to get phone array and count syllables
    function wordToPhones(word){
        return cmu.get(word).split(' ');
    }
    function countSyllables(phones){
        return phones.filter(el=>!isNaN(el.at(-1))).length;
    }

    //Filter the word list:
    // - Words not in CMU dictionary are removed
    // - Monosyllabic words are removed
    // - Words starting with vowels are removed since they're not easily handleable for now
    const spoonerWords = words.filter(
        el => cmu.get(el)
           && countSyllables(wordToPhones(el)) > 1
           && isNaN(wordToPhones(el)[0].at(-1))
    );

    //Functions to split a word for spoonerisms
    function getFirstConsonantSound(word){
        const phones = wordToPhones(word);
        const idx = phones.findIndex(el => !isNaN(el.at(-1)));
        if(idx <= 0){
            return [];
        }
        return phones.slice(0, idx);
    }
    function splitWord(word){
        const phones = wordToPhones(word);
        const consPrefix = getFirstConsonantSound(word);
        const remPhones = phones.slice(consPrefix.length);
        return [consPrefix, remPhones];
    }

    //Set up a reverse mapping of pronunciation to word
    const reversePronounciationMap = new Map();
    for(const word of spoonerWords){
        const pronunciation = wordToPhones(word).join('');
        if(!reversePronounciationMap.has(pronunciation)){
            reversePronounciationMap.set(pronunciation, []);
        }
        reversePronounciationMap.get(pronunciation).push(word);
    }

    //Set up dictionaries storing all possible root stem pairs (root = first consonant sound)
    const stemsForRoot = new Map();
    const rootsForStem = new Map();
    for(const word of spoonerWords){
        let [root, stem] = splitWord(word);
        root = root.join('');
        stem = stem.join('');
        if(!stemsForRoot.has(root)){
            stemsForRoot.set(root, new Set());
        }
        stemsForRoot.get(root).add(stem);
        if(!rootsForStem.has(stem)){
            rootsForStem.set(stem, new Set());
        }
        rootsForStem.get(stem).add(root);
    }


    //set.intersection doesn't work for some reason, so handwritten:    
    function setIntersect(set1, set2){
        const res = new Set();
        if(set2.length < set1.length){
            for(const el of set2){
                if(set1.has(el)){
                    res.add(el);
                }
            }
        } else {
            for(const el of set1){
                if(set2.has(el)){
                    res.add(el);
                }
            }
        }
        return res;
    }

    let finalWords = [];

    //Mark spoonerable words
    for(const word of spoonerWords){
        let [root1, stem1] = splitWord(word);
        root1 = root1.join('');
        stem1 = stem1.join('');
        for(const stem2 of stemsForRoot.get(root1)){
            if(stem2 === stem1){
                continue;
            }
            const candidateRoot2s = setIntersect(rootsForStem.get(stem2), rootsForStem.get(stem1));
            for(const root2 of candidateRoot2s){
                if(root2 === root1){
                    continue;
                }
                const word2 = reversePronounciationMap.get(root2+stem2)[0];
                const word3 = reversePronounciationMap.get(root2+stem1)[0];
                const word4 = reversePronounciationMap.get(root1+stem2)[0];
                if(word3 === word || word4 === word2){
                    continue;
                }   

                const prev = wordMasks.get(word);
                wordMasks.set(word, prev | clueTypeBit.spoonerisms);
                finalWords.push(word);
                break;
            }
            if(wordMasks.get(word) & clueTypeBit.spoonerisms){
                break;
            }
        }
    }

    //Also save a word to pronunciation map of spoonerable word cos the browser can't use cmudict
    const pronounciationMap = new Map();
    for(const word of finalWords){
        const pronounciation = wordToPhones(word);
        pronounciationMap.set(word, pronounciation);
    }
    //Save reverse pronounciation and stem to root and root to stem maps:
    saveMap(reversePronounciationMap, path.resolve(outFolder, 'reversePronounciationMap.js'));
    saveMap(pronounciationMap, path.resolve(outFolder, 'pronounciationMap.js'))
    //Sets don't translate to json, so convert them to arrays
    for(const key of stemsForRoot.keys()) stemsForRoot.set(key, [...stemsForRoot.get(key)]);
    for(const key of rootsForStem.keys()) rootsForStem.set(key, [...rootsForStem.get(key)]);
    saveMap(stemsForRoot, path.resolve(outFolder, 'stemsForRoot.js'));
    saveMap(rootsForStem, path.resolve(outFolder, 'rootsForStem.js'));

    console.log("Spoonerisms done!");
}

//JOEYS
function preprocessJoeys(){
    //Filter dictionary - joeys need to be at least 3 letters
    const minJoeyLength = 3;
    const joeyWords = words.filter(el => el.length >= minJoeyLength);
    joeyWords.sort((a, b) => a.length - b.length);
    const joeyWordSet = new Set(joeyWords);

    //Find joeys by iterating over all subsets
    function checkJoeysBruteForce(word){
        const n = word.length;
        if (n < minJoeyLength + 1) return;
        for (let i = 1; i < (1 << n) - 1; i++) {
            let joeyCand = "";
            for (let j = 0; j < n; j++) {
                if ((1 << j) & i) {
                    joeyCand += word[j];
                }
            }
            if (joeyCand.length < minJoeyLength) continue;
            if (word.includes(joeyCand)) continue;
            if (joeyWordSet.has(joeyCand)) {
                const prev = wordMasks.get(word);
                wordMasks.set(word, prev | clueTypeBit.joeys);
                break;
            }
        }
    }
    //utility function - get length of LCS
    function lcsLength(a, b) {
        const m = a.length, n = b.length;
        const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (a[i - 1] === b[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[m][n];
    }
    //Find joeys by comparing LCS
    function checkJoeysLCS(word1) {
        for (const word2 of joeyWords) {
            if (word2.length >= word1.length) return;
            if (word1.includes(word2)) return;
            if (lcsLength(word1, word2) === word2.length) {
                const prev = wordMasks.get(word1);
                wordMasks.set(word1, prev | clueTypeBit.joeys);
                break;
            }
        }
    }

    //Breakpoint at which to switch to LCS function
    //This is found empirically by estimating when 2^length becomes larger than the number of words in the dictionary
    const breakpoint = 15;
    for(const word of joeyWords){
        if(word.length < breakpoint){
            checkJoeysBruteForce(word);
        } else {
            checkJoeysLCS(word);
        }
    }

    console.log("Joeys done!")
}


function saveObj(obj, file){
    const content = `export const data = ${JSON.stringify(obj, null, 2)};`;
    fs.writeFileSync(file, content);
}


function saveMap(map, file) {
    const obj = Object.fromEntries(map);
    const content = `export const data = new Map(Object.entries(${JSON.stringify(obj, null, 2)}));`;
    fs.writeFileSync(file, content);
}





