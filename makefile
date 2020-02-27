.PHONY: test
.PHONY: fmt

test:
	deno test --allow-run *.test.ts

fmt:
	deno fmt *.ts
