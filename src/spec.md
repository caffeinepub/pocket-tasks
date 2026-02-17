# Specification

## Summary
**Goal:** Build a mobile-first task manager with a polished, accessible UI and persistent task CRUD backed by a single Motoko canister.

**Planned changes:**
- Create a responsive, mobile-first layout with bottom (or compact) navigation and touch-friendly, accessible controls.
- Implement task CRUD: create (title required, description optional), list, details view, edit, and delete with confirmation.
- Add productivity controls: completion toggle, filters (All / Active / Completed), and sorting (e.g., newest first).
- Persist tasks in the Motoko backend with clear list/create/update/delete methods and upgrade-safe stable storage.
- Apply a consistent modern visual theme (avoid blue+purple), including typography, spacing, and component styling across screens.
- Add and reference custom static images (app icon + empty state) stored under `frontend/public/assets/generated` and show empty state when no tasks exist.

**User-visible outcome:** Users can comfortably manage tasks on a phone (and larger screens), including creating/editing/deleting tasks, marking them complete, filtering/sorting the list, viewing task details, and seeing tasks persist after refresh, with a coherent visual theme plus an app icon and empty-state illustration.
