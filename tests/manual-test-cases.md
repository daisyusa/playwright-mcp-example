# Manual Test Cases: The Internet

**Base URL:** `https://the-internet.herokuapp.com`

These cases cover five links from the app's home page: Add/Remove Elements,
Checkboxes, Dropdown, Form Authentication, and Status Codes.

## Notes

- Start each UI case from a fresh page unless the steps say otherwise.
- The app does not provide a JSON API for Add/Remove Elements, Checkboxes, or
  Dropdown. Their changing state is handled in the browser. The API cases for
  those pages are HTTP/HTML smoke checks, not tests of a REST resource.
- Form Authentication uses a standard HTML form (`POST /authenticate`).
- The Status Codes endpoints intentionally return the named HTTP status; the
  301 endpoint does not redirect to another URL.

## Add/Remove Elements

**Page:** `/add_remove_elements/`

### UI-01 — Add and remove elements

**Steps**

1. Open `/add_remove_elements/`.
2. Confirm there are no `Delete` buttons initially.
3. Click **Add Element** twice.
4. Click one **Delete** button.

**Expected results**

- The page heading is **Add/Remove Elements** and **Add Element** is visible.
- Two **Delete** buttons appear after the two clicks.
- One **Delete** button remains after deleting one element.

### API-01 — Add/Remove page HTTP response

**Steps**

1. Send `GET /add_remove_elements/` to the base URL.
2. Inspect the HTTP response status and HTML body.

**Expected results**

- The response status is `200`.
- The response is an HTML page containing the **Add/Remove Elements** heading
  and the **Add Element** control.
- No create/delete API response is expected; those actions are client-side.

## Checkboxes

**Page:** `/checkboxes`

### UI-02 — Toggle checkbox states

**Steps**

1. Open `/checkboxes`.
2. Confirm the initial state of both checkboxes.
3. Click **checkbox 1**.
4. Click **checkbox 2**.

**Expected results**

- Initially, **checkbox 1** is unchecked and **checkbox 2** is checked.
- After step 3, both checkboxes are checked.
- After step 4, **checkbox 1** is checked and **checkbox 2** is unchecked.
- Toggling a checkbox does not navigate away from the page.

### API-02 — Checkboxes page HTTP response

**Steps**

1. Send `GET /checkboxes` to the base URL.
2. Inspect the HTTP response status and returned HTML.

**Expected results**

- The response status is `200`.
- The HTML contains two checkbox inputs and the **Checkboxes** heading.
- On a fresh page load, the first input is unchecked and the second is checked.
- Checkbox changes are not persisted through a separate API.

## Dropdown

**Page:** `/dropdown`

### UI-03 — Select each available option

**Steps**

1. Open `/dropdown`.
2. Confirm **Please select an option** is selected initially.
3. Select **Option 1**.
4. Select **Option 2**.

**Expected results**

- The control is a dropdown with **Option 1** and **Option 2**.
- After step 3, **Option 1** is the selected value.
- After step 4, **Option 2** is the selected value.
- The selection is shown in the dropdown and the page remains open.

### API-03 — Dropdown page HTTP response

**Steps**

1. Send `GET /dropdown` to the base URL.
2. Inspect the HTTP response status and returned HTML.

**Expected results**

- The response status is `200`.
- The HTML contains the **Dropdown List** heading, the disabled placeholder,
  and options **Option 1** and **Option 2**.
- The selected option is browser state; there is no separate selection API.

## Form Authentication

**Page:** `/login`

### UI-04 — Reject invalid credentials

**Steps**

1. Open `/login`.
2. Enter an invalid username and password.
3. Click **Login**.

**Expected results**

- The login is rejected and an error notification is displayed.
- The user is not taken to the secure area.

### UI-05 — Log in with valid credentials

**Steps**

1. Open `/login`.
2. Enter username `tomsmith`.
3. Enter password `SuperSecretPassword!`.
4. Click **Login**.

**Expected results**

- The user is redirected to the secure area.
- A success notification confirms login.
- The secure area displays a **Logout** control.

### API-04 — Authenticate with valid and invalid credentials

**Steps**

1. Send `GET /login`; inspect the response and form.
2. Submit `POST /authenticate` with form-encoded fields
   containing a username and password, preserving cookies
   and following redirects.
3. Repeat the POST with invalid credentials.

**Expected results**

- `GET /login` returns `200` HTML containing the login form.
- The login form submits to `/authenticate` using `POST`.
- Valid credentials redirect to `/secure`; after following the redirect, the
  final response is `200` and confirms login with a logout control.
- Invalid credentials return `200`, keep the user on `/login`, and display an
  error notification. They do not grant access to the secure area.

## Status Codes

**Page:** `/status_codes`

### UI-06 — Open each status-code example

**Steps**

1. Open `/status_codes`.
2. Click each of the **200**, **301**, **404**, and **500** links, returning to
   `/status_codes` between selections if needed.

**Expected results**

- Each link opens a page that identifies the selected status code, such as
  **This page returned a 404 status code.**
- The page content identifies the code matching the link clicked.

### API-05 — Verify status-code endpoint responses

**Steps**

1. Send a `GET` request for each endpoint:
   - `/status_codes/200`
   - `/status_codes/301`
   - `/status_codes/404`
   - `/status_codes/500`
2. Record the response status, final URL, and response body.

**Expected results**

| Endpoint | HTTP status | Response body includes |
|---|---:|---|
| `/status_codes/200` | `200` | `This page returned a 200 status code.` |
| `/status_codes/301` | `301` | `This page returned a 301 status code.` |
| `/status_codes/404` | `404` | `This page returned a 404 status code.` |
| `/status_codes/500` | `500` | `This page returned a 500 status code.` |

- Each response remains at its requested endpoint; the `301` response is not
  followed by a redirect to a different path.
