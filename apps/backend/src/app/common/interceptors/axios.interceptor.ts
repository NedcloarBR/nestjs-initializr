import {
	BadRequestException,
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor
} from "@nestjs/common";
import { catchError, type Observable } from "rxjs";
import { AxiosResolveError } from "../errors/axios.error";

@Injectable()
export class AxiosInterceptor implements NestInterceptor {
	public intercept(
		_context: ExecutionContext,
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
