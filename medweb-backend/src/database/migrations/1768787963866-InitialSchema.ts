import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1768787963866 implements MigrationInterface {
    name = 'InitialSchema1768787963866'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(50) NOT NULL, "password_hash" character varying(255) NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'pending', "role" character varying(20) NOT NULL DEFAULT 'user', "full_name" character varying(100) NOT NULL, "hospital" character varying(200), "department" character varying(100), "position" character varying(100), "phone" character varying(20), "email" character varying(100), "purpose" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "last_login_at" TIMESTAMP, "failed_login_attempts" integer NOT NULL DEFAULT '0', "locked_until" TIMESTAMP, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fe0bb3f6520ee0469504521e71" ON "users" ("username") `);
        await queryRunner.query(`CREATE INDEX "IDX_3676155292d72c67cd4e090514" ON "users" ("status") `);
        await queryRunner.query(`CREATE TABLE "form_versions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "version" character varying(50) NOT NULL, "description" text, "schema_json" jsonb NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'draft', "created_by" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "published_at" TIMESTAMP, CONSTRAINT "PK_46dbd35ef6adf11a8684deae1b1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8d325f1f4493fc09eafc534cc3" ON "form_versions" ("status") `);
        await queryRunner.query(`CREATE TABLE "cases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "case_number" character varying(50) NOT NULL, "created_by" uuid NOT NULL, "form_version_id" uuid NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'draft', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "submitted_at" TIMESTAMP, "patient_hospital_number" character varying(100), "patient_admission_date" date, "arrest_type" character varying(20), CONSTRAINT "UQ_e4b62fdecb8c5dfac7caf8c312e" UNIQUE ("case_number"), CONSTRAINT "PK_264acb3048c240fb89aa34626db" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e4b62fdecb8c5dfac7caf8c312" ON "cases" ("case_number") `);
        await queryRunner.query(`CREATE INDEX "IDX_16623a33f4933798b679f058d0" ON "cases" ("created_by") `);
        await queryRunner.query(`CREATE INDEX "IDX_c71df5e7279ba08e88c6b47a55" ON "cases" ("status") `);
        await queryRunner.query(`CREATE TABLE "case_answers" ("case_id" uuid NOT NULL, "answers_json" jsonb NOT NULL DEFAULT '{}', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5e09df95770285c99119e59f9fc" PRIMARY KEY ("case_id"))`);
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "actor_id" uuid, "actor_username" character varying(50), "action" character varying(100) NOT NULL, "target_type" character varying(50), "target_id" uuid, "meta_json" jsonb, "ip_address" inet, "user_agent" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_177183f29f438c488b5e8510cd" ON "audit_logs" ("actor_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_cee5459245f652b75eb2759b4c" ON "audit_logs" ("action") `);
        await queryRunner.query(`CREATE INDEX "IDX_2cd10fda8276bb995288acfbfb" ON "audit_logs" ("created_at") `);
        await queryRunner.query(`CREATE TABLE "approval_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'pending', "submitted_at" TIMESTAMP NOT NULL DEFAULT now(), "reviewed_at" TIMESTAMP, "reviewer_id" uuid, "decision_note" text, CONSTRAINT "PK_484806bb8ff331b851fc75973c0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c6740434e173350a435676415c" ON "approval_requests" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_40474ff19c594757c811a1343c" ON "approval_requests" ("status") `);
        await queryRunner.query(`ALTER TABLE "form_versions" ADD CONSTRAINT "FK_55e6f886b31ce5b87182243d0fb" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cases" ADD CONSTRAINT "FK_16623a33f4933798b679f058d0b" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cases" ADD CONSTRAINT "FK_0bd9ef561bfdf9c456ef79599b1" FOREIGN KEY ("form_version_id") REFERENCES "form_versions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "case_answers" ADD CONSTRAINT "FK_5e09df95770285c99119e59f9fc" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_177183f29f438c488b5e8510cdb" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "approval_requests" ADD CONSTRAINT "FK_c6740434e173350a435676415c2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "approval_requests" ADD CONSTRAINT "FK_de19c7d19cfbcf9130d1f6e837f" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "approval_requests" DROP CONSTRAINT "FK_de19c7d19cfbcf9130d1f6e837f"`);
        await queryRunner.query(`ALTER TABLE "approval_requests" DROP CONSTRAINT "FK_c6740434e173350a435676415c2"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_177183f29f438c488b5e8510cdb"`);
        await queryRunner.query(`ALTER TABLE "case_answers" DROP CONSTRAINT "FK_5e09df95770285c99119e59f9fc"`);
        await queryRunner.query(`ALTER TABLE "cases" DROP CONSTRAINT "FK_0bd9ef561bfdf9c456ef79599b1"`);
        await queryRunner.query(`ALTER TABLE "cases" DROP CONSTRAINT "FK_16623a33f4933798b679f058d0b"`);
        await queryRunner.query(`ALTER TABLE "form_versions" DROP CONSTRAINT "FK_55e6f886b31ce5b87182243d0fb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_40474ff19c594757c811a1343c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c6740434e173350a435676415c"`);
        await queryRunner.query(`DROP TABLE "approval_requests"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2cd10fda8276bb995288acfbfb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cee5459245f652b75eb2759b4c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_177183f29f438c488b5e8510cd"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
        await queryRunner.query(`DROP TABLE "case_answers"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c71df5e7279ba08e88c6b47a55"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_16623a33f4933798b679f058d0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e4b62fdecb8c5dfac7caf8c312"`);
        await queryRunner.query(`DROP TABLE "cases"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8d325f1f4493fc09eafc534cc3"`);
        await queryRunner.query(`DROP TABLE "form_versions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3676155292d72c67cd4e090514"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fe0bb3f6520ee0469504521e71"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
