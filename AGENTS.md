# Project rules
- Keep persistent mobile navigation at the router level, outside animated page headers, so fixed positioning stays viewport-relative on every page.
- Render calculator summary rows as labeled, two-line mobile grids and desktop table grids so editable rates never require horizontal scrolling.
- Render weight-list item names on a full-width mobile line with labeled reading, weight and price fields below; use the compact table only from tablet width so long item names and thickness labels cannot overlap.
- Keep mobile navigation and calculator action offsets in shared CSS variables, including safe-area insets, so fixed controls do not cover content.
- Generate weight reports from the same computed row weights and prices as the page, embedding the original logo locally in the report module so PDF downloads do not depend on remote image loading.