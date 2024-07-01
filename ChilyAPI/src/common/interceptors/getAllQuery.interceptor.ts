import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class GetAllQueryInterceptor implements NestInterceptor { 
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const page = request.query.page ? parseInt(request.query.page) : 0;
        const limit = request.query.limit ? parseInt(request.query.limit) : 0;
        request.page = page;
        request.limit = limit;
        return next.handle();
    }    
}