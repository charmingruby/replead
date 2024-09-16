import { randomUUID } from 'crypto'

export interface LeadProps {
  name: string
  email: string
  jobTitle: string
}

export class Lead {
  private _id: string
  private _name: string
  private _email: string
  private _jobTitle: string

  get id() {
    return this._id
  }

  set id(s: string) {
    this._id = s
  }

  get name() {
    return this._name
  }

  set name(s: string) {
    this._name = s
  }

  get email() {
    return this._email
  }

  set email(s: string) {
    this._email = s
  }

  get jobTitle() {
    return this._jobTitle
  }

  set jobTitle(s: string) {
    this._jobTitle = s
  }

  constructor(props: LeadProps) {
    this._id = randomUUID()
    this._name = props.name
    this._email = props.email
    this._jobTitle = props.jobTitle
  }
}
