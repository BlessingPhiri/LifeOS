# Quick Capture API

## POST /api/quick-capture
Create a low-friction capture item.

Request body:
```json
{
  "type": "note",
  "value": { "text": "Review budget" }
}
```

Allowed `type` values:
- `transaction`
- `habit`
- `note`
- `task`
- `mood`

Validation errors return HTTP `422` with `details`.

## Overview response
`GET /api/overview` now includes a `captures` array with up to 10 most recent entries.
