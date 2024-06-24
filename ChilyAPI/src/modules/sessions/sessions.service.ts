import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './sessions.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SessionsService implements OnModuleInit {
    constructor(
        @InjectRepository(Session) private sessionRepository: Repository<Session>,
        private dataSource: DataSource

) {}

    async onModuleInit() {
        await this.createTriggerFunction();
        await this.createTrigger();
    }

    async createSession(accessToken: string, expiresAt: Date, blacklisted: boolean): Promise<Session | Error> {
        try {
            const session = this.sessionRepository.create({accessToken, expiresAt, blacklisted});
            console.log(session);
            return await this.sessionRepository.save(session);
        } catch {
            throw new Error("Error al crear la sesión");
        }
    }

    async getSession(accessToken: string): Promise<Session | Error> {
        try {
            return await this.sessionRepository.findOneBy({accessToken});
        } catch {
            throw new Error("Sesión no encontrada");
        }
    }

    async blacklistSession(accessToken: string): Promise<Boolean> {
        try {
            const session = await this.sessionRepository.findOneBy({accessToken});
            await this.sessionRepository.delete(session);
            return true;
        } catch {
            return false;
        }
    }



    private async createTriggerFunction() {
        const createFunctionQuery = `
          CREATE OR REPLACE FUNCTION delete_expired_sessions()
          RETURNS TRIGGER AS $$
          BEGIN
            IF NEW."expiresAt" < NOW() THEN
              DELETE FROM "session" WHERE id = NEW.id;
            END IF;
            RETURN NULL; -- Indica que el registro ha sido eliminado
          END;
          $$ LANGUAGE plpgsql;
        `;
        await this.dataSource.query(createFunctionQuery);
      }
    
      private async createTrigger() {
        const createTriggerQuery = `
          CREATE TRIGGER check_expiry
          BEFORE INSERT OR UPDATE ON "session"
          FOR EACH ROW
          EXECUTE FUNCTION delete_expired_sessions();
        `;
        await this.dataSource.query(createTriggerQuery);
      }
}
