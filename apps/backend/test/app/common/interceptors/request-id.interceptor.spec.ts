import "reflect-metadata";
import { Test, type TestingModule } from "@nestjs/testing";
import { of } from "rxjs";
import { RequestIdInterceptor } from "@/app/common/interceptors/request-id.interceptor";

function makeContext(headerRequestId?: string) {
	const request: Record<string, unknown> = {
		headers: headerRequestId ? { "x-request-id": headerRequestId } : {},
		requestId: undefined
	};

	const replyHeaders: Record<string, string> = {};
	const reply = {
		header(key: string, value: string) {
			replyHeaders[key] = value;
		},
		_headers: replyHeaders
	};

	const context = {
		switchToHttp: () => ({
			getRequest: () => request,
			getResponse: () => reply
		})
	};

	return { context, request, reply };
}

describe("RequestIdInterceptor", () => {
	let interceptor: RequestIdInterceptor;
	const next = { handle: () => of(null) };

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [RequestIdInterceptor]
		}).compile();

		interceptor = module.get<RequestIdInterceptor>(RequestIdInterceptor);
	});

	it("uses the x-request-id header when present", () => {
		const { context, request } = makeContext("existing-id");

		interceptor.intercept(context as never, next as never);

		expect(request.requestId).toBe("existing-id");
	});

	it("generates a UUID and assigns it to requestId when header is absent", () => {
		const { context, request } = makeContext();

		interceptor.intercept(context as never, next as never);

		expect(typeof request.requestId).toBe("string");
		expect((request.requestId as string).length).toBeGreaterThan(0);
	});

	it("sets the x-request-id response header when generating a new id", () => {
		const { context, reply } = makeContext();

		interceptor.intercept(context as never, next as never);

		expect(reply._headers["x-request-id"]).toBeDefined();
	});

	it("does not override the response header when the request already has an id", () => {
		const { context, reply } = makeContext("already-set");

		interceptor.intercept(context as never, next as never);

		expect(reply._headers["x-request-id"]).toBeUndefined();
	});

	it("returns the observable from next.handle()", (done) => {
		const { context } = makeContext();

		const result$ = interceptor.intercept(context as never, next as never);

		result$.subscribe({
			next: (val) => {
				expect(val).toBeNull();
				done();
			}
		});
	});
});
