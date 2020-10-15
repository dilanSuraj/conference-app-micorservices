const axios = require('axios');

class CircuitBreaker {

    constructor(){
        this.state = {};
        this.failureThreshold = 5;
        this.cooldownPeriod = 10;
        this.requestTimeout = 1;
    }

    onSuccess(endpoint) {
        this.initState(endpoint);
    }

    onFailure(endpoint) {
        const state = this.state[endpoint];
        state.failures += 1;
        if(state.failures > this.failureThreshold) {
            state.circuit = 'OPEN';
            state.nextTry = new Date() /1000 + this.cooldownPeriod;
            console.log(`ALERT! Circuit for ${endpoint} is in state OPEN`)
        }
    }

    canRequest(endpoint) {
        const state = this.state[endpoint];
        if(state.circuit === 'CLOSED') return true;

        const now = new Date() /1000;
        if( state.nextTry <= now) {
            state.circuit = 'HALF';
            return true;
        }
        return false;
    }

    initState(endpoint) {
        this.state[endpoint] = {
            failures: 0,
            cooldownPeriod: this.cooldownPeriod,
            circuit: 'CLOSED',
            nextTry: 0
        }
    }
}

module.exports = CircuitBreaker;