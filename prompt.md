# Conversation Prompt Summary

## Summary

The requests in this conversation asked to:

1. Explore five links on The Internet demo app and document UI/API manual test cases.
2. Automate those cases with Playwright using page objects, reusable methods,
   fixtures where useful, and specs inside `tests/`.
3. Add Grafana k6 API performance tests with configurable targets, workload
   profiles, checks, thresholds, report exports, package scripts, and run
   instructions.

## Full prompts

### 1. Manual test cases

> Using playwright mcp, navigate to the baseurl https://the-internet.herokuapp.com and explore any 5 links in this app, write manual cases of UI and API with test steps and expected results. Save all test cases to tests/manual-test-cases.md

### 2. Playwright automation and page object model

> - create page folders and use page object model
> - always keep resuable methods under page folders
> - use fixture if needed, add fixture folder inside the root folder and put fixture file inside it.
> - put all the test spec files in tests folders
> - page folder should be inside the root folder
> - automate all the test cases in the manual-test-cases.md with the help of playwright mcp.

### 3. Add Grafana k6 performance testing

> - Add API performance testing to this repo using Grafana k6.
> - Inspect the existing API routes and tests, then cover the main endpoints.
> - Use a configurable base URL, realistic load, stress, smoke scenarios, checks, and thresholds.
> - Add a package script and brief run instructions, including how to send results to Grafana Cloud k6.
> - Provide the command to run the test and view the results live (k6 web dashboard).
> - Provide the command to save the report (HTML dashboard export plus JSON summary), and ignore generated report files in .gitignore
