import { Migration } from '@mikro-orm/migrations';

export class Migration20210827112701 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `user` (`id` varchar(255) not null, `name` varchar(255) not null, `email` varchar(255) not null, `position` enum(\'sales\', \'financial\', \'marketing\', \'dev\', \'network\', \'stores\') not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `user` add primary key `user_pkey`(`id`);');
    this.addSql('alter table `user` add unique `user_email_unique`(`email`);');

    this.addSql('create table `intern` (`id` varchar(255) not null, `fullname` varchar(255) not null, `email` varchar(255) not null, `date_of_birth` datetime not null, `position` enum(\'sales\', \'financial\', \'marketing\', \'dev\', \'network\', \'stores\') not null, `school` varchar(255) not null, `academic_year` datetime not null, `supervisor_id` varchar(255) not null, `hired_at` datetime not null, `end_internship` datetime not null, `intern_status` enum(\'active\', \'employed\', \'dismissed\', \'standby\') not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `intern` add primary key `intern_pkey`(`id`);');
    this.addSql('alter table `intern` add unique `intern_fullname_unique`(`fullname`);');
    this.addSql('alter table `intern` add unique `intern_email_unique`(`email`);');
    this.addSql('alter table `intern` add index `intern_supervisor_id_index`(`supervisor_id`);');

    this.addSql('create table `review` (`id` varchar(255) not null, `intern_id` varchar(255) not null, `supervisor_id` varchar(255) not null, `initiative` int(11) not null, `cooperation` int(11) not null, `performance` int(11) not null, `consistency` int(11) not null, `total` int(11) not null, `created_at` datetime not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `review` add primary key `review_pkey`(`id`);');
    this.addSql('alter table `review` add index `review_intern_id_index`(`intern_id`);');
    this.addSql('alter table `review` add index `review_supervisor_id_index`(`supervisor_id`);');

    this.addSql('create table `candidate` (`id` varchar(255) not null, `name` varchar(255) not null, `email` varchar(255) not null, `mobile` varchar(255) not null, `position` enum(\'sales\', \'financial\', \'marketing\', \'dev\', \'network\', \'stores\') not null, `employment_type` enum(\'fulltime\', \'parttime\', \'internship\') not null, `degree` varchar(255) not null, `status` enum(\'pending\', \'accepted\', \'rejected\', \'standby\') not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `candidate` add primary key `candidate_pkey`(`id`);');
    this.addSql('alter table `candidate` add unique `candidate_email_unique`(`email`);');

    this.addSql('create table `interview` (`id` varchar(255) not null, `candidate_id` varchar(255) not null, `interviewer_id` varchar(255) not null, `start_time` datetime not null, `end_time` datetime not null, `experience` int(11) not null, `degree` int(11) not null, `comments` varchar(255) not null, `grading` int(11) not null, `status` enum(\'pending\', \'accepted\', \'rejected\', \'standby\') not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `interview` add primary key `interview_pkey`(`id`);');
    this.addSql('alter table `interview` add index `interview_candidate_id_index`(`candidate_id`);');
    this.addSql('alter table `interview` add index `interview_interviewer_id_index`(`interviewer_id`);');

    this.addSql('alter table `intern` add constraint `intern_supervisor_id_foreign` foreign key (`supervisor_id`) references `user` (`id`) on update cascade;');

    this.addSql('alter table `review` add constraint `review_intern_id_foreign` foreign key (`intern_id`) references `intern` (`id`) on update cascade;');
    this.addSql('alter table `review` add constraint `review_supervisor_id_foreign` foreign key (`supervisor_id`) references `user` (`id`) on update cascade;');

    this.addSql('alter table `interview` add constraint `interview_candidate_id_foreign` foreign key (`candidate_id`) references `candidate` (`id`) on update cascade;');
    this.addSql('alter table `interview` add constraint `interview_interviewer_id_foreign` foreign key (`interviewer_id`) references `user` (`id`) on update cascade;');
  }

}
