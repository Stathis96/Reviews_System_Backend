import { Migration } from '@mikro-orm/migrations';

export class Migration20210906133854 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `intern` modify `hired_at` datetime null, modify `end_internship` datetime null;');

    this.addSql('alter table `interview` modify `comments` varchar(255) null;');
  }

}
