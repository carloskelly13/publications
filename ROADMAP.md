# Publications 8 Roadmap

This roadmap tracks the work required to move Publications from a capable single-page drawing editor into a practical publication editor. Priorities favor architectural work before features that would otherwise need to be rebuilt around it.

## Current foundation

- [x] Fastify REST API with PostgreSQL persistence
- [x] Google OAuth and server-backed sessions
- [x] Vite, React, TypeScript, Tailwind CSS, and generated API types
- [x] Document workspace with templates and rendered previews
- [x] Rectangle, ellipse, line, and rich-text shapes
- [x] Move, resize, rotate, multi-select, snapping, and marquee selection
- [x] Fill, border, opacity, radius, typography, and metric controls
- [x] Layers, reordering, duplication, deletion, cut, copy, and paste
- [x] Undo and redo with grouped editor transactions
- [x] Chromium PDF export with bundled fonts
- [x] Light, dark, and system appearance modes

## 1. Multi-page documents

The database and API already represent documents as arrays of pages, but the editor and export path currently operate on the first page only.

- [ ] Introduce an explicit active-page state
- [ ] Remove first-page assumptions from editor mutations and history
- [ ] Add a page navigator with page thumbnails
- [ ] Add, duplicate, delete, and reorder pages
- [ ] Keep page dimensions and properties independent per page
- [ ] Render saved-document thumbnails from the appropriate page
- [ ] Export every page into one ordered PDF
- [ ] Define safe behavior when deleting the final page

Completion means a document can contain differently sized pages that can be edited, reordered, saved, reopened, and exported as one PDF.

## 2. Images

- [ ] Add an image shape to the shared API model
- [ ] Choose persistent asset storage for production and local development
- [ ] Add image upload and insertion
- [ ] Support contain, cover, and original-size placement
- [ ] Add crop positioning within an image frame
- [ ] Preserve aspect ratio while resizing when requested
- [ ] Render images consistently in the editor, thumbnails, and PDFs
- [ ] Define missing-asset and failed-upload states

Completion means uploaded images survive reloads and render identically in the editor and exported PDF.

## 3. Alignment and precision tools

- [ ] Align selected objects left, center, right, top, middle, and bottom
- [ ] Distribute selected objects horizontally and vertically
- [ ] Add smart alignment and spacing guides
- [ ] Add arrow-key nudging with modifier-based increments
- [ ] Add an aspect-ratio lock for resizing
- [ ] Add modifier behavior for centered and constrained transforms

## 4. Layer capabilities

- [ ] Rename layers
- [ ] Hide and show layers
- [ ] Lock and unlock layers
- [ ] Group and ungroup objects
- [ ] Represent groups clearly in the Layers panel
- [ ] Make group operations atomic in undo and redo

## 5. Typography

- [ ] Line height
- [ ] Letter spacing
- [ ] Paragraph spacing
- [ ] Text-box padding
- [ ] Vertical text alignment
- [ ] Additional list and paragraph controls where TipTap supports them cleanly
- [ ] Text overflow indicators

## 6. Page setup

- [ ] Common page-size presets
- [ ] Portrait and landscape switching
- [ ] Page background color
- [ ] Margins and optional margin guides
- [ ] Bleed settings and bleed guides
- [ ] Optional crop marks during PDF export

## 7. Unsaved-change protection

- [ ] Track a clear saved-versus-dirty document state
- [ ] Warn before navigating away with unsaved changes
- [ ] Warn before closing or reloading the browser tab
- [ ] Preserve intentional manual saving unless autosave is added as an explicit mode
- [ ] Keep save failures visible and recoverable

## 8. Cross-document clipboard

- [ ] Serialize copied shapes into a stable clipboard payload
- [ ] Paste between documents in the same browser session
- [ ] Paste between tabs when browser clipboard permissions allow it
- [ ] Preserve rich text, layers, and image references
- [ ] Version clipboard payloads for future model changes

## Ongoing quality work

- [ ] Keep canvas, workspace thumbnails, and PDF rendering in parity
- [ ] Maintain keyboard and screen-reader accessibility for editor controls
- [ ] Add focused regression coverage for document persistence and rendering
- [ ] Split large client bundles when it materially improves startup performance
- [ ] Verify Vercel builds and PDF font assets before production releases
