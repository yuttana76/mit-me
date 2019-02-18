import { Choice } from "./choice.model";

export class Question {
    constructor(
        public id: string,
        public name: string,
        public image: string = '',
        public answer: string = '',
        public multilchoice: boolean,
        public require: boolean,
        // public questions: Array<Question>,
        public choices: Array<Choice>
        ) {
    }
}
