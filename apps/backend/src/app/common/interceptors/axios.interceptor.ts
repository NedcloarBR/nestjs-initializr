import {
	BadRequestException,
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor
} from "@nestjs/common";
import { type Observable, catchError } from "rxjs";
import { AxiosResolveError } from "../errors/axios.error";

@Injectable()
export class AxiosInterceptor implements NestInterceptor {
	public intercept(
		context: ExecutionContext,
		next: CallHandler<unknown>
	): Observable<unknown> | Promise<Observable<unknown>> {
		return next.handle().pipe(
			catchError((error) => {
				if (error instanceof AxiosResolveError) {
					throw new BadRequestException(error.message);
				}
				throw error;
			})
		);
	}
}
