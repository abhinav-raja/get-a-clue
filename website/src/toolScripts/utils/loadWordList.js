import fs from 'fs';
import {data as wordMasks} from '../data/wordList.js'

export function loadWordList() {
    const words = Array.from(wordMasks.keys());
    return words;
}

export function loadFilteredWordList(mask){
    const words = [];
    for(const [word, wordMask] of wordMasks){
        if(mask & wordMask){
            words.push(word);
        }
    }
    return words;
}
