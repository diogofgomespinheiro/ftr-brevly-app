import { v7 as uuid } from 'uuid';

import { ValueObject } from './value-object';

interface UniqueEntityIDProps {
  value: string;
}

export class UniqueEntityID extends ValueObject<UniqueEntityIDProps> {
  toString() {
    return this.props.value;
  }

  toValue() {
    return this.props.value;
  }

  private constructor(props: UniqueEntityIDProps) {
    super(props);
  }

  static create(value?: string) {
    return new UniqueEntityID({ value: value ?? uuid() });
  }
}
