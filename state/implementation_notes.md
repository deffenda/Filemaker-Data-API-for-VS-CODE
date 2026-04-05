# Implementation Notes

## CHANGED

- `extension/src/webviews/recordEditor/ui/index.js`

## DID

- Added a local `debounce(fn, ms)` helper and applied a shared 200ms debounced dirty-state notifier to record editor textarea input handlers.
- Replaced the `fieldEditor.innerHTML = ''` rebuild flow with a one-time table build plus a stored textarea reference map.
- Updated discard and record refresh flows to reuse the existing textarea nodes and only overwrite `value` in place when field keys are unchanged.

## VALIDATED

- `npm run lint`
- `node --check extension/src/webviews/recordEditor/ui/index.js`

## NEXT

- Review the pull request for Task 2 and validate the reduced record editor flicker behavior.
