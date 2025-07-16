function randomChoice(arr){
    const len = arr.length;
    return arr[Math.floor(Math.random() * len)];
}

export default randomChoice;