import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";


@Injectable()
export class QueryInterceptor implements NestInterceptor { 
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const page = request.query.page ? parseInt(request.query.page) : 1;
        const limit = request.query.limit ? parseInt(request.query.limit) : 5;
        request.page = page;
        request.limit = limit;
        return next.handle();
    }    
}