# MADMEDIA DEVELOPING Website — davidlangarica.dev Style

A premium dark-themed, scroll-animated single-page website for **MADMEDIA DEVELOPING**, closely inspired by davidlangarica.dev's layout, feel, and animation style.

## Proposed Changes

### Core Files

#### [NEW] [index.html](file:///c:/Users/IgnatMadalin/Desktop/MADMEDIA%20DEVELOPING%20WEBSITE/index.html)
Full single-page HTML with sections:
- **Navbar**: Logo left, numbered nav links right (1 Home, 2 About, 3 Services, 4 Contact), with animated underline
- **Hero**: Large heading "Creative Studio" with rotating subtitle (Web Development / Digital Marketing / Brand Identity), scroll indicator, animated gradient text
- **About**: Two-column layout, reveal-on-scroll text, marquee text strip "AND YUP, I CREATE DIGITAL EXPERIENCES LIKE A WORK OF ART..."
- **Services/Work**: Grid of cards with hover tilt effects, overlays, and project tags
- **Contact**: Bold CTA + email copy button + booking link
- **Footer**: Copyright line

#### [NEW] [style.css](file:///c:/Users/IgnatMadalin/Desktop/MADMEDIA%20DEVELOPING%20WEBSITE/style.css)
- Dark background (#0a0a0a), off-white text (#f0f0f0)
- Accent color: electric blue/purple gradient
- Custom cursor (dot + ring that follow mouse)
- Smooth scroll
- Hero text on 3 lines with large typography (clamp-based)
- Rotating subtitle with fade-in/out animation
- Marquee strip animation (infinite scroll)
- Scroll reveal animations (fade up, split text)
- Service cards: glassmorphism + hover 3D tilt
- Numbered nav with hover underline animation
- Progress bar or scroll line indicator

#### [NEW] [script.js](file:///c:/Users/IgnatMadalin/Desktop/MADMEDIA%20DEVELOPING%20WEBSITE/script.js)
- Custom cursor tracking
- Rotating tagline cycling (Web Developer → Digital Marketer → Brand Designer)
- Intersection Observer for scroll reveals
- Scroll percentage progress bar
- Smooth scroll for nav anchors
- Card 3D tilt on hover (mousemove perspective transform)
- Loading/intro animation ("Heading to MADMEDIA's universe...")
- Text split animations using character-by-character reveals

## Sections Content

| Section | Content |
|---------|---------|
| Hero | "Creative Studio" — rotating: Web Development / Digital Marketing / Brand Identity |
| About | Who MADMEDIA is, passion for digital craft |
| Services | Web Dev, UI/UX Design, Digital Marketing, Brand Identity, Social Media, SEO |
| Contact | Email + Book a call CTA |

## Verification Plan

### Manual Verification
1. Open `index.html` directly in a modern browser (Chrome/Edge)
2. Verify the loading intro animation plays and fades out
3. Verify Hero section has the rotating text animation working
4. Scroll down — verify scroll reveal animations trigger on each section
5. Hover over service cards — verify 3D tilt effect
6. Move mouse — verify custom cursor follows
7. Click nav links — verify smooth scroll to sections
8. Check the marquee strip scrolls infinitely
9. Resize window — verify responsive layout at mobile/tablet widths
