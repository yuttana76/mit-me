
export class Choice {
    // name: string;
    // value: number;

    constructor(
        public id: string,
        public name: string,
        public value: number
    ) {
        // this.name = _name;
        // this.value = _value;
    }
}

export class Question {

    expanded = true;
    checked = false;

    constructor(
        public id: string,
        public name: string,
        public image: string = '',
        public multilchoice: boolean,
        public questions: Array<Question>,
        public choices: Array<Choice>) {
    }

    toggle() {
        this.expanded = !this.expanded;
    }

    getIcon() {

        if (this.expanded) {
            return '-';
        }

        return '+';
    }

    check() {
        this.checked = !this.checked;
        this.checkRecursive(this.checked);
    }

    checkRecursive(state: boolean) {
        this.questions.forEach(d => {
            d.checked = state;
            d.checkRecursive(state);
        });
    }
}
