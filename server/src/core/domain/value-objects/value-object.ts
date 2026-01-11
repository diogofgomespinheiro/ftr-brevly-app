export abstract class ValueObject<Props> {
  public props: Props

  constructor(props: Props) {
    const baseProps: Props = {
      ...props,
    }

    this.props = baseProps
  }

  public equals(vo?: ValueObject<Props>): boolean {
    if (vo === null || vo === undefined) {
      return false
    }
    if (vo.props === undefined) {
      return false
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props)
  }
}
