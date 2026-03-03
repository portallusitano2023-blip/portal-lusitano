# Fix: validateAndRecord is not a function

## Error

```
Runtime TypeError: validateAndRecord is not a function
  at useQuizLogic.useCallback[handleAnswer] (components/analise-perfil/useQuizLogic.ts:245:31)
  at onClick (components/analise-perfil/QuizSection.tsx:248:36)
```

## Root Cause

`validateAndRecord` is a `useCallback` from `useToolAccess` hook that could be undefined during component initialization or async state transitions, causing it to be called before it's defined.

## Solution

Added guard checks before calling `validateAndRecord` in all places it's used:

### Files Fixed

1. **components/analise-perfil/useQuizLogic.ts** (line 245)
   - Added: `if (!validateAndRecord) { setError(...); return; }`
   - Then: `const allowed = await validateAndRecord(...)`

2. **components/calculadora-valor/useCalculadoraState.ts** (line 265)
   - Added same guard check before the call
   - Same error handling pattern

## Testing

- [ ] Open `/analise-perfil` and complete quiz → results should show
- [ ] Open `/calculadora-valor` and calculate value → should process
- [ ] Verify both tools still track tool_usage correctly
- [ ] Verify paywall still works after 1 free use

## Commit

This is a hotfix to the monetization fix. Files affected by the prior refactor are now stable.
