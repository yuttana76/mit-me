
export class Choice {
    public answer = '';
    constructor(
        public id: string,
        public name: string,
        public value: number
    ) {
    }
}

export class Question {
    constructor(
        public id: string,
        public name: string,
        public image: string = '',
        public answer: string = '',
        public multilchoice: boolean,
        // public questions: Array<Question>,
        public choices: Array<Choice>
        ) {
    }
}
