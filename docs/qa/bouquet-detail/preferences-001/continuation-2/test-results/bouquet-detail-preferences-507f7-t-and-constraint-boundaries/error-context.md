# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bouquet-detail-preferences.spec.ts >> continuous intrinsic geometry across viewport and constraint boundaries
- Location: tests/e2e/bouquet-detail-preferences.spec.ts:287:5

# Error details

```
Error: page.evaluate: TypeError: Cannot read properties of null (reading 'getBoundingClientRect')
    at eval (eval at evaluate (:370:30), <anonymous>:10:26)
    at Array.map (<anonymous>)
    at eval (eval at evaluate (:370:30), <anonymous>:8:25)
    at UtilityScript.evaluate (<anonymous>:372:16)
    at UtilityScript.<anonymous> (<anonymous>:1:44)
```