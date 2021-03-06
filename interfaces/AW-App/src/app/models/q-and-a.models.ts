export enum AnswerType {
  // Translate the types used in the API to internal, proper types:
  Number = 'numeric',
  Text = 'text',
  Date = 'date',
  Enum = 'dropdown',
  phoneNumber = 'tel',
  email = 'email',
}

export class Question {
  code: string;
  answerType: AnswerType;
  label: string;
  placeholder?: string;
  options: QuestionOption[] | null;
}

export class QuestionOption {
  value: string;
  label: string;
}

export class Answer {
  code: string;
  value: string;
  label: string;
}

export class AnswerSet {
  [code: string]: Answer;
}
