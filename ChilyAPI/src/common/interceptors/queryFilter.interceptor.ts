import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class QueryFilterInterceptor implements NestInterceptor { 
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const page = request.query.page ? parseInt(request.query.page) : 1;
        const limit = request.query.limit ? parseInt(request.query.limit) : 5;
        const min = request.query.min ? parseInt(request.query.min) : 0;
        const max = request.query.max ? parseInt(request.query.max) : Infinity;
        request.page = page;
        request.limit = limit;
        request.min = min;
        request.max = max;
        return next.handle();
    }    
}