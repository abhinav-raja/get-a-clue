import { loadWordList } from "./utils/loadWordList.js";

const wordList = loadWordList();

const rotagrams = {
    name: "rotagrams",
    label: "Rotagrams",
    desc: "A bunch of words of the same length written down as the rows of a grid. Each column is then rotated by some amount like a combination lock (not shuffled arbitrarily!), giving you a puzzle where you have to get the original words.",

    inputs: [
        { label: "Number of words", value: 5 },
        { label: "Length of each word", value: 10 }
    ],

    runFunction(inputs) {

        //Fisher Yates shuffle, then take the first few elements
        function sample(array, n) {
            const arr = [...array];
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr.slice(0, n);
        }

        function randomRotate(array){
            const n = array.length;
            const x = Math.floor(Math.random()*n);
            return [...array.slice(-x), ...array.slice(0, -x)]
        }

        const n = inputs[0];
        const m = inputs[1];

        const filteredWordList = wordList.filter(el => el.length === m);
        const words = sample(filteredWordList, n);
        const cols = [];
        for(let i = 0; i < m; i++){
            cols.push(randomRotate(words.map(el => el[i])));
        }
        const puzzle = [];
        for(let i = 0; i < n; i++){
            puzzle.push(cols.map(el => el[i]).join(""));
        }

        const result = [
            puzzle.join('\n')
            + '\n\nANSWERS\n'
            + words.join('\n')
        ];
        return result;
    }
};

export default rotagrams;