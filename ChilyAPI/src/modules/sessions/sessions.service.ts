import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './sessions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SessionsService {
    constructor(@InjectRepository(Session) private sessionRepository: Repository<Session>) {}

    async createSession(accessToken: string, blacklisted: boolean): Promise<Session | Error> {
        try {
            const session = this.sessionRepository.create({accessToken, blacklisted});
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

}
