# Export Instructions

Generate HTML + PDF from this sample using mdBook + Pandoc (or md-to-pdf of choice).

```bash
cd reports/samples/sample-core-audit
mdbook build
# Convert the HTML to PDF
pandoc book/html/index.html -o exports/nightwatch-qa-sample-core.pdf
```

`nightwatch-qa-sample-core.pdf` is expected to contain the rendered report. For now this README documents the process until the automation step is wired.
