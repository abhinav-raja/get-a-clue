const randomizer = {
    inputs: [
        {label: "Numbers to generate", value: 1}
    ],
    runFunction(inputs){
        let n = inputs[0];
        let result = [];
        for(let i = 0; i < n; i++){
            result.push(Math.random());
        }
        return result;
    }
}

export default randomizer;