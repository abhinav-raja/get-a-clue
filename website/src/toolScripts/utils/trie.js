class Trie {
    aCharCode = 'a'.charCodeAt(0);
    terminator = String.fromCharCode(this.aCharCode + 26);

    constructor(words=[]){
        this.nextFreeNode = 0;
        this.next = [];
        this.addNode();
        for(let word of words){
            this.add(word);
        }
    }

    addNode(){
        this.next.push(Array(26).fill(-1));
        return this.nextFreeNode++;
    }

    add(str){
        str = str.toLowerCase();
        str += this.terminator;
        let currNode = 0;
        for(let char of str){
            let idx = char.charCodeAt(0) - this.aCharCode;
            if(idx < 0 || idx > 26){
                throw(`Cannot add "${str}" to trie - string contains nonalphabet characters`);
            }
            if(this.next[currNode][idx] === -1){
                this.next[currNode][idx] = this.addNode();
            }
            currNode = this.next[currNode][idx];
        }
    }

    query(pref){
        pref = pref.toLowerCase();
        let currNode = 0;
        let result = pref;
        for(let char of pref){
            let idx = char.charCodeAt(0) - this.aCharCode;
            if(idx < 0 || idx > 26){
                throw(`Cannot query "${pref}" in trie - string contains nonalphabet characters`);
            }
            if(this.next[currNode][idx] === -1){
                return "";
            }
            currNode = this.next[currNode][idx];
        }
        while(Math.max(...this.next[currNode]) !== -1){
            let options = [];
            for(let i = 0; i < 26; i++){
                if(this.next[currNode][i] != -1){
                    options.push(i);
                }
            }
            let choice = options[Math.floor(Math.random()*options.length)];
            result += String.fromCharCode(this.aCharCode + choice);
            currNode = this.next[currNode][choice];
        }
        return result;
    }

    isValidWord(word){
        word = word.toLowerCase();
        word += this.terminator;
        let currNode = 0;
        for(let char of word){
            let idx = char.charCodeAt(0) - this.aCharCode;
            if(idx < 0 || idx > 26){
                return false;
            }
            if(this.next[currNode][idx] === -1){
                return false;
            }
            currNode = this.next[currNode][idx];
        }
        return true;
    }

    isValidPrefix(pref){
        pref = pref.toLowerCase();
        let currNode = 0;
        for(let char of pref){
            let idx = char.charCodeAt(0) - this.aCharCode;
            if(idx < 0 || idx > 26){
                return false;
            }
            if(this.next[currNode][idx] === -1){
                return false;
            }
            currNode = this.next[currNode][idx];
        }
        return (this.next[currNode].filter((el)=> el !== -1).length > (this.next[currNode][26] === -1));
    }

    prefixValidity(word){
        word = word.toLowerCase();
        let result = []
        let currNode = 0;
        for(let char of word){
            let idx = char.charCodeAt(0) - this.aCharCode;
            if(idx < 0 || idx > 26){
                return result;
            }
            if(this.next[currNode][idx] === -1){
                return result;
            }
            currNode = this.next[currNode][idx];
            result.push(this.next[currNode][26] !== -1);
        }
        return result;
    }
};

export default Trie;

