import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialDataBase1726521159387 implements MigrationInterface {
    name = 'InitialDataBase1726521159387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "image" character varying, "isActive" boolean NOT NULL DEFAULT true, "externalId" character varying, "provider" "public"."users_provider_enum" NOT NULL DEFAULT 'GOOGLE', "type" "public"."users_type_enum" NOT NULL DEFAULT 'PRINCIPAL', "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "number" integer NOT NULL, "bank" "public"."cards_bank_enum" NOT NULL, "limit" integer NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_5f3269634705fdff4a9935860fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "total" integer NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "price" double precision NOT NULL, "status" "public"."transactions_status_enum" NOT NULL, "movementType" "public"."transactions_movementtype_enum" NOT NULL, "methodType" "public"."transactions_methodtype_enum" NOT NULL, "type" "public"."transactions_type_enum" NOT NULL, "date" TIMESTAMP NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "cardId" uuid, "accountId" uuid, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cards" ADD CONSTRAINT "FK_7b7230897ecdeb7d6b0576d907b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_3aa23c0a6d107393e8b40e3e2a6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_d1dac70b33bf7a903782df5b637" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_26d8aec71ae9efbe468043cd2b9" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_26d8aec71ae9efbe468043cd2b9"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_d1dac70b33bf7a903782df5b637"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_3aa23c0a6d107393e8b40e3e2a6"`);
        await queryRunner.query(`ALTER TABLE "cards" DROP CONSTRAINT "FK_7b7230897ecdeb7d6b0576d907b"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`DROP TABLE "cards"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
