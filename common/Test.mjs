

export default class Test {
    constructor(foo) {
        this.foo = foo
    }

    static fromJSONString(json) {
        return Object.assign(new Test(), JSON.parse(json))
    }
}