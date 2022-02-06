import { Migration } from '@mikro-orm/migrations';

export class Migration20210916075115 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `intern` modify `academic_year` datetime null;');
  }

}
