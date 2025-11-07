# School Navigation Kiosk - Design Guidelines

## Design Approach

**Selected Approach:** Material Design System with Mall Directory Kiosk Inspiration

**Justification:** This is a utility-focused, information-dense application where usability and accessibility are paramount. Material Design provides excellent touch interaction patterns, clear visual hierarchy, and proven accessibility standards - perfect for public kiosk usage.

**Key Principles:**
- Touch-first interactions with generously sized tap targets (minimum 48px)
- High contrast and legibility for viewing from various distances
- Clear visual feedback for all interactions
- Intuitive wayfinding through bold typography and iconography

## Typography

**Font Family:** Roboto (via Google Fonts CDN) - optimized for digital displays

**Scale:**
- Display (Idle/Welcome): 72px, Bold - welcoming headlines
- H1 (Floor Headers): 48px, Medium - section identifiers
- H2 (Location Names): 32px, Medium - primary content
- Body Large (Search Results): 24px, Regular - readable list items
- Body (Descriptions): 20px, Regular - secondary information
- Caption (Helper Text): 16px, Regular - subtle guidance

**Hierarchy:** Bold weight for interactive elements, medium for headers, regular for body content

## Layout System

**Spacing Primitives:** Tailwind units of 4, 6, 8, 12, 16 for consistent rhythm
- Touch targets: min-h-16 (64px) for all interactive elements
- Section padding: p-8 to p-12 for breathing room
- Card spacing: gap-6 between elements, p-8 internal padding
- Screen margins: px-12 to accommodate large touch areas

**Grid Structure:**
- Main content: Full-width centered max-w-7xl container
- Search results: Single column list for clarity
- Quick access: 2x3 or 3x2 grid of large buttons
- Floor selector: Horizontal row of pill-shaped buttons

## Component Library

### Navigation & Core UI

**Top Bar:**
- Full-width with school logo/name (left), current time (right)
- Height: h-20, fixed positioning
- Breadcrumb navigation for multi-step flows

**Search Interface:**
- Prominent search bar: h-16 with large text input (24px)
- Autocomplete dropdown with 24px text, generous padding (p-4)
- Clear button (X) always visible when text present
- Magnifying glass icon (Heroicons)

**Floor Map Display:**
- Full-width interactive SVG canvas
- Zoom controls: Large +/- buttons (w-16 h-16) in bottom-right
- "You Are Here" marker: Pulsing red dot with label
- Selected destination: Highlighted in accent color with route line

### Interactive Elements

**Quick Access Buttons:**
- Large rectangular cards: min-h-32 with icon + label
- Icons from Heroicons (outline style, 48px)
- 2-column grid on landscape kiosks (grid-cols-2 gap-6)
- Categories: Main Office, Restrooms, Cafeteria, Library, Emergency Exit, Nurse

**Floor Selector:**
- Horizontal pill buttons showing floor numbers/names
- Active floor: filled style, inactive: outline
- Height: h-14, min-width: w-24
- Arranged in flex row with gap-4

**Location Cards (Search Results):**
- Full-width list items with h-20 minimum
- Left: Icon representing room type (24px)
- Center: Room name (24px bold) + room number (20px regular)
- Right: Arrow icon indicating tappable
- Dividers between items

**Action Buttons:**
- Primary CTA: h-16 with 24px text, rounded corners
- "Show Route" button prominent on location details
- "Start Over" button accessible but secondary styling

### Overlays & Modals

**Location Detail Modal:**
- Centered overlay with backdrop blur
- Large heading (32px) with room name
- Details list: hours, contact, description
- Route button prominent at bottom
- Close X in top-right corner (48px tap target)

**Idle Screen:**
- Full-screen branded background
- School logo centered (256px width)
- "Tap Anywhere to Start" text (48px)
- Pulsing subtle animation on text only

### Data Display

**Directory List:**
- Categorized accordion sections (Classrooms, Offices, Facilities)
- Section headers: 32px medium with chevron icon
- Collapsible content with smooth expansion
- Alphabetically sorted within categories

**Route Display:**
- Turn-by-turn text instructions in numbered list
- Each step: 24px text with icon
- Estimated walking time displayed
- Print option for route (if applicable)

## Accessibility & Touch Optimization

- All interactive elements: minimum 48x48px tap targets
- Focus states: 4px outline for keyboard navigation
- High contrast ratios: 4.5:1 minimum for all text
- No hover states - design for touch-only interaction
- Auto-timeout after 60 seconds of inactivity returns to idle screen
- Screen reader support for map annotations

## Images

**Hero/Idle Screen:**
- School building facade or campus aerial view as background
- Subtle overlay (20% opacity) to ensure text legibility
- Image dimensions: 1920x1080 optimized for landscape kiosks

**Category Icons:**
- Custom building/room type illustrations for visual wayfinding
- Placed in quick access buttons and search results
- Use Heroicons library for consistency

## Animations

**Minimal Implementation:**
- Idle screen: Gentle pulse on "Tap to Start" text (2s interval)
- Route drawing: Animated line trace from start to destination (1s duration)
- Floor transitions: Simple fade (300ms)
- No scroll animations, parallax, or decorative motion