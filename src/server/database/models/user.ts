import { Model } from "objection";

export class UserModel extends Model {
  static get tableName() {
    return "users";
  }

  readonly id!: number | string;
  user_name!: string;
  password_hash!: string;
}
