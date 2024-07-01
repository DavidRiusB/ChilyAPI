import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, map } from "rxjs";

@Injectable()
export class RemovePropertiesInterceptor implements NestInterceptor {
  constructor(private readonly propertiesToRemove: string[]) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        if (data) {
          this.removePropertiesRecursive(data, this.propertiesToRemove);
        }
        return data;
      })
    );
  }
  private removePropertiesRecursive(
    obj: any,
    propertiesToRemove: string[]
  ): void {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (propertiesToRemove.includes(prop)) {
          delete obj[prop];
        } else if (typeof obj[prop] === "object" && obj[prop] !== null) {
          if (Array.isArray(obj[prop])) {
            obj[prop].forEach((item) => {
              this.removePropertiesRecursive(item, propertiesToRemove);
            });
          } else {
            this.removePropertiesRecursive(obj[prop], propertiesToRemove);
          }
        }
      }
    }
  }
}
