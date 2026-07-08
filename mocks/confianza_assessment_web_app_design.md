# Confianza Assessment Web App Design

## Design Direction

This design is for the **assessment-first teaching experience** inside the Confianza web app. It is not a landing page, dashboard, or marketing page. The learner should experience one focused step at a time, with a calm guided flow that feels personal, supportive, and safe.

The core purpose of this screen is to begin the learning profile assessment before the course starts. The experience should feel like a warm conversation with a language coach, not a test.

---

## Product Context

**Product:** Confianza  
**Experience:** Web-based English learning app  
**Primary audience:** Spanish-speaking beginner English learners in Colombia  
**Screen type:** Assessment question screen  
**Stage:** Question 7 of 22  
**Goal:** Understand how the learner learns before generating their learning profile and adaptive English course.

---

## Core UX Principle

The app should show **one focused panel or process at a time**.

Do not show:

- A dashboard
- Multiple app screens at once
- A product overview
- Landing page sections
- Course cards before the learner has completed the assessment
- Analytics panels
- A cluttered navigation sidebar

The learner should feel guided through a single calm assessment moment.

---

## Screen Concept

### Page URL

`app.confianza.co/assessment`

### Screen Name

**Learning Combination Assessment**

### Screen Purpose

To ask one reflective learning-style question and allow the learner to select the answer that feels most natural to them.

The screen should make the learner feel:

- Safe
- Understood
- Unrushed
- Encouraged
- In control
- Free from judgement

---

## Layout Structure

The web app uses a browser-style frame to make it clear this is a web-based teaching app.

### Overall Layout

The page is split into two main zones:

1. **Left emotional guidance panel**
2. **Right assessment interaction panel**

The left side provides reassurance and atmosphere.  
The right side contains the active question and answer choices.

This creates a focused learning environment without feeling like a dashboard.

---

## Left Panel

### Purpose

The left panel provides emotional safety and brand warmth. It reminds the learner that the assessment is not a test.

### Content

Logo:

**Confianza**

Main reassurance message:

**There are no wrong answers here.**  
No hay respuestas malas aquí.

Support message:

**We are learning how you learn.**  
Estamos aprendiendo cómo aprendes tú.

Small reassurance chip:

**No pressure**  
Sin presión

### Visual Treatment

The left panel includes a warm Colombian café street illustration or soft image treatment:

- Café table
- Coffee cup
- Open notebook
- Pen
- Warm street scene
- Colombian everyday life reference
- Calm daylight
- Soft blur or atmospheric depth

The visual should feel grounded and human, not generic tech stock imagery.

### Mood

Warm, calm, Colombian, personal, reflective.

---

## Right Panel

### Purpose

This is the active assessment step. It should be the only functional focus of the screen.

### Top Progress Area

At the top center:

**Question 7 of 22**

Below it:

- Soft horizontal progress bar
- Deep teal filled section
- Pale sand remaining track

Top right utility option:

**Save and continue later**  
Guarda y continúa después

This should feel helpful, not like an exit warning.

---

## Assessment Card

### Card Styling

The central question appears inside a large rounded white card.

Style:

- Large radius corners
- Soft shadow
- Warm white background
- Spacious padding
- Clear hierarchy
- Calm border
- No harsh outlines

### Question Text

**When something finally makes sense to you, it is usually because...**  
Cuando algo finalmente tiene sentido para ti, normalmente es porque...

The English text should be bold and prominent.  
The Spanish support text should sit directly underneath in a softer muted tone.

---

## Answer Cards

Each answer is a large horizontal card, designed for easy selection on desktop and tablet.

### Answer Options

1. **I try it myself**  
   Lo intento por mi cuenta

2. **I watch someone show me**  
   Veo a alguien mostrarme

3. **I need steps**  
   Necesito pasos

4. **I like examples**  
   Me gustan los ejemplos

5. **It depends on my mood**  
   Depende de mi estado de ánimo

### Answer Card Style

Each answer card includes:

- Soft circular icon area on the left
- English answer label
- Spanish support line underneath
- Large tap/click area
- Rounded rectangle shape
- Calm cream or white background

### Selected State

The selected answer should use:

- Warm amber border
- Soft amber glow
- Pale amber background wash
- Check icon on the right

The selected state should feel positive and calm, not like a quiz result.

---

## Bottom Guidance Text

Below the answer list:

**Take your time. You can skip and return later.**  
Tómate tu tiempo. Puedes volver después.

Use a small clock icon or soft line icon.

Tone should be gentle and reassuring.

---

## Navigation Controls

At the bottom of the assessment area:

### Back Button

**Back**  
Atrás

Style:

- White or cream background
- Subtle border
- Rounded rectangle
- Left arrow icon
- Calm hover state

### Next Button

**Next**  
Siguiente

Style:

- Deep teal background `#0E7C66`
- White text
- Rounded rectangle
- Right arrow icon
- Soft shadow
- Large click area

The Next button should feel confident but not aggressive.

---

## Visual Identity

### Primary Colours

| Role | Colour | Usage |
|---|---:|---|
| Deep Teal | `#0E7C66` | Primary buttons, progress, key icons, brand identity |
| Warm Amber | `#E8A13C` | Selected answer state, soft highlights, emotional warmth |
| Soft Cream | `#F7F1E7` | Page background, secondary surfaces |
| Warm White | `#FFFDF8` | Cards and panels |
| Sand | `#E8DDCB` | Borders, progress tracks, dividers |
| Muted Slate | `#52636A` | Spanish support text, helper text |
| Deep Ink Teal | `#093B3A` | Main headings and important text |

### Avoid

Do not use red warning states.  
Do not use aggressive gamification colours.  
Do not use harsh black text.  
Do not use corporate blue.

---

## Typography

Use a modern rounded sans-serif pairing with a premium but friendly feel.

Suggested fonts:

- **Headings:** Nunito Sans, Sora, Plus Jakarta Sans, or similar rounded modern sans
- **Body:** Inter, Nunito Sans, or Plus Jakarta Sans
- **Spanish support text:** Same font, smaller size, lighter colour

### Type Hierarchy

#### Main reassurance heading

Large, calm, emotional.

Example:

**There are no wrong answers here.**

#### Assessment question

Large and clear, centered in the card.

#### Answer labels

Medium weight, easy to scan.

#### Spanish support text

Smaller, muted, directly connected to the English text.

---

## Bilingual Copy Rules

Every key piece of interface copy should show English first, Spanish support underneath.

The Spanish should feel like emotional scaffolding, not a separate translation block.

Example structure:

**English action or message**  
Spanish support line

Keep the Spanish shorter where possible so the interface does not feel crowded.

---

## Interaction Behaviour

### Selecting an Answer

When a learner selects an answer:

- The selected card gains amber border and soft glow
- A check icon appears on the right
- The Next button becomes visually ready
- No score appears
- No judgement appears

### Moving Forward

Clicking **Next / Siguiente** moves to the next assessment question.

### Saving Progress

Clicking **Save and continue later / Guarda y continúa después** stores progress and reassures the learner they can return.

Suggested confirmation copy:

**Saved. You can continue whenever you are ready.**  
Guardado. Puedes continuar cuando estés listo.

---

## Emotional Design Rules

Use language that encourages confidence.

### Use

- No pressure
- Take your time
- We are learning how you learn
- You can return later
- This helps us support you better
- There are no wrong answers here

### Avoid

- Wrong
- Failed
- Incorrect
- Bad answer
- Try harder
- Error
- Required field
- You missed something

If validation is needed, use soft language:

**Choose the answer that feels closest today.**  
Elige la respuesta que se siente más cercana hoy.

---

## Responsive Behaviour

### Desktop

Use a two-column layout:

- Left reassurance and atmosphere panel: approximately 34 percent width
- Right assessment panel: approximately 66 percent width

### Tablet

Keep two columns if space allows. Reduce padding and image height.

### Mobile

Convert to a single-column flow:

1. Logo
2. Progress bar
3. Reassurance message
4. Assessment card
5. Answer cards
6. Guidance text
7. Sticky bottom Back and Next controls

The mobile version must still show one question at a time.

---

## Component Specification

### Browser Frame

Use a subtle browser shell to indicate this is a web app:

- Rounded browser container
- Light top bar
- URL field showing `app.confianza.co/assessment`
- Minimal browser icons

Do not over-emphasise the browser frame. It is context only.

### Logo

The logo sits at top left inside the app experience.

Suggested mark:

- Leaf or sprout symbol
- Deep teal
- Human, organic, calm

### Progress Bar

- Height: 8 to 10px
- Rounded ends
- Filled colour: deep teal
- Track colour: pale sand
- Label above: Question 7 of 22

### Answer Card

Default state:

- Background: warm white
- Border: soft sand
- Radius: 20 to 24px
- Shadow: very soft

Selected state:

- Border: warm amber
- Background: pale amber cream
- Right icon: amber check circle

### Buttons

Primary:

- Deep teal background
- White text
- Large rounded rectangle
- Soft shadow
- Arrow icon on right

Secondary:

- White or cream background
- Sand border
- Deep teal text
- Arrow icon on left for Back

---

## Accessibility Notes

- All answer cards must be keyboard selectable
- Selected state must not rely on colour alone, include check icon
- Contrast should be comfortable but not harsh
- Touch targets should be at least 44px high, ideally larger
- Progress text should be readable by screen readers
- Spanish support text should be associated with the English label

---

## Build Notes for Codex

Create this as a single focused assessment screen in a web app.

Use:

- React or Next.js style components
- CSS variables for colours
- Responsive layout
- No external dashboard framework
- No analytics dashboard layout
- No marketing landing page sections
- No multi-screen collage

Recommended component structure:

```txt
AssessmentPage
├── BrowserFrame
│   ├── AppHeader
│   ├── LeftSupportPanel
│   └── AssessmentPanel
│       ├── AssessmentProgress
│       ├── QuestionCard
│       │   ├── QuestionText
│       │   └── AnswerOptionList
│       ├── GentleHelperText
│       └── AssessmentNavigation
```

---

## Example Data Object

```js
const assessmentQuestion = {
  currentQuestion: 7,
  totalQuestions: 22,
  question: "When something finally makes sense to you, it is usually because...",
  questionEs: "Cuando algo finalmente tiene sentido para ti, normalmente es porque...",
  answers: [
    {
      id: "doing",
      label: "I try it myself",
      labelEs: "Lo intento por mi cuenta",
      icon: "hand"
    },
    {
      id: "watching",
      label: "I watch someone show me",
      labelEs: "Veo a alguien mostrarme",
      icon: "eye"
    },
    {
      id: "steps",
      label: "I need steps",
      labelEs: "Necesito pasos",
      icon: "steps"
    },
    {
      id: "examples",
      label: "I like examples",
      labelEs: "Me gustan los ejemplos",
      icon: "book"
    },
    {
      id: "mood",
      label: "It depends on my mood",
      labelEs: "Depende de mi estado de ánimo",
      icon: "cloudSun"
    }
  ],
  selectedAnswerId: "watching"
};
```

---

## Final Design Intention

This screen should make the learner think:

**“This app is not testing me. It is trying to understand me.”**

The design should feel like the beginning of a personal learning journey, where confidence comes before performance.
