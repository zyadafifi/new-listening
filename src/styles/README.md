# CSS Architecture Documentation

## Overview

This project uses a component-based CSS architecture that organizes styles into logical, maintainable files. The architecture follows modern CSS best practices and provides excellent scalability, maintainability, and performance.

## Directory Structure

```
src/styles/
├── base/                    # Global styles and foundations
│   ├── variables.css        # CSS custom properties (variables)
│   ├── reset.css           # CSS reset and base styles
│   ├── typography.css      # Typography system
│   └── animations.css      # Keyframes and animation utilities
├── components/             # Component-specific styles
│   ├── Header.css
│   ├── LessonCard.css
│   ├── TipsPanel.css
│   ├── AudioControls.css
│   ├── ExerciseArea.css
│   ├── ProgressTracker.css
│   └── FeedbackDisplay.css
├── pages/                  # Page-specific styles
│   ├── HomePage.css
│   └── LessonPage.css
├── phases/                 # Phase-specific styles
│   ├── ListeningPhase.css
│   └── DictationPhase.css
├── layouts/                # Layout utilities
│   ├── Container.css
│   ├── Grid.css
│   └── Responsive.css
├── utilities/              # Utility classes
│   ├── Buttons.css
│   ├── Forms.css
│   ├── Icons.css
│   └── States.css
├── main.css               # Main entry point
└── README.md              # This documentation
```

## File Organization Principles

### 1. Base Styles (`base/`)

Contains global styles that apply across the entire application:

- **variables.css**: CSS custom properties for colors, spacing, typography, etc.
- **reset.css**: CSS reset and base element styles
- **typography.css**: Typography system and text utilities
- **animations.css**: Keyframes and animation utilities

### 2. Component Styles (`components/`)

Each React component has its own CSS file:

- **Naming**: `ComponentName.css` (PascalCase)
- **Scope**: Styles specific to that component only
- **Dependencies**: Can use base variables and utilities
- **Import**: Imported in the component file

### 3. Page Styles (`pages/`)

Styles specific to entire pages:

- **Naming**: `PageName.css` (PascalCase)
- **Scope**: Page-level layouts and page-specific components
- **Dependencies**: Can use base, components, and utilities

### 4. Phase Styles (`phases/`)

Styles for specific phases or workflows:

- **Naming**: `PhaseName.css` (PascalCase)
- **Scope**: Phase-specific components and layouts
- **Dependencies**: Can use base, components, and utilities

### 5. Layout Styles (`layouts/`)

Layout utilities and grid systems:

- **Container.css**: Container and wrapper styles
- **Grid.css**: Grid system and layout utilities
- **Responsive.css**: Responsive design utilities

### 6. Utility Styles (`utilities/`)

Reusable utility classes:

- **Buttons.css**: Button variants and states
- **Forms.css**: Form elements and validation states
- **Icons.css**: Icon utilities and variants
- **States.css**: Hover, focus, active, and other state utilities

## Naming Conventions

### CSS Classes

- **BEM Methodology**: `.component__element--modifier`
- **Component Prefixes**: Use component-specific prefixes to avoid conflicts
- **Utility Classes**: Use descriptive names (e.g., `.btn-primary`, `.text-center`)

### File Naming

- **Components**: `ComponentName.css` (PascalCase)
- **Utilities**: `utility-name.css` (kebab-case)
- **Base**: `category-name.css` (kebab-case)

### CSS Custom Properties

- **Prefix**: `--color-`, `--spacing-`, `--font-`, etc.
- **Naming**: `--category-specific-name` (kebab-case)
- **Examples**: `--color-primary`, `--spacing-4`, `--font-size-lg`

## Color System

The color system is defined in `variables.css` using CSS custom properties:

```css
:root {
  /* Primary Colors */
  --color-primary: #63a29b;
  --color-primary-dark: #275151;
  --color-primary-light: #4a8b85;

  /* Neutral Colors */
  --color-gray-50: #f8fafc;
  --color-gray-100: #f1f5f9;
  /* ... more grays */

  /* Status Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}
```

## Typography System

Typography is organized in `typography.css`:

```css
/* Font Sizes */
--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
/* ... more sizes */

/* Font Weights */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
/* ... more weights */
```

## Spacing System

Consistent spacing using CSS custom properties:

```css
:root {
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  /* ... more spacing */
}
```

## Responsive Design

Responsive utilities are organized in `Responsive.css`:

- **Mobile First**: Base styles for mobile, then larger breakpoints
- **Breakpoints**: 320px, 640px, 768px, 1024px, 1280px, 1536px
- **Utility Classes**: `.sm:text-lg`, `.md:grid-cols-3`, etc.

## Component Integration

Each component imports its own CSS file:

```jsx
// Component.jsx
import React from "react";
import "../styles/components/ComponentName.css";

const Component = () => {
  return <div className="component-class">Content</div>;
};
```

## Performance Considerations

1. **CSS Custom Properties**: Used for theming and consistency
2. **Scoped Styles**: Component-specific styles prevent conflicts
3. **Utility Classes**: Reusable classes reduce duplication
4. **Tree Shaking**: Unused styles can be removed during build
5. **Critical CSS**: Base styles are loaded first

## Best Practices

### 1. Component Styling

- Keep component styles in their own file
- Use descriptive class names
- Avoid deep nesting (max 3 levels)
- Use CSS custom properties for consistency

### 2. Responsive Design

- Mobile-first approach
- Use utility classes for responsive behavior
- Test on multiple devices and screen sizes

### 3. Performance

- Minimize CSS specificity
- Use efficient selectors
- Avoid unnecessary overrides
- Leverage CSS custom properties

### 4. Maintenance

- Keep related styles together
- Use consistent naming conventions
- Document complex styles
- Regular cleanup of unused styles

## Migration from App.css

The original `App.css` (4,312 lines) has been reorganized into:

- **Base styles**: 4 files (~800 lines)
- **Component styles**: 7 files (~1,200 lines)
- **Page styles**: 2 files (~400 lines)
- **Phase styles**: 2 files (~300 lines)
- **Layout styles**: 3 files (~500 lines)
- **Utility styles**: 4 files (~600 lines)
- **Main entry**: 1 file (~200 lines)

**Total**: 23 organized files vs. 1 monolithic file

## Benefits

1. **Maintainability**: Easy to find and update specific styles
2. **Scalability**: Easy to add new components and pages
3. **Collaboration**: Multiple developers can work on different components
4. **Performance**: Better tree-shaking and loading optimization
5. **Debugging**: Easier to locate and fix styling issues
6. **Reusability**: Shared utilities and base styles

## Future Enhancements

1. **CSS Modules**: Consider CSS Modules for better scoping
2. **PostCSS**: Add PostCSS for advanced CSS processing
3. **CSS-in-JS**: Consider CSS-in-JS for dynamic styling
4. **Design System**: Expand into a full design system
5. **Theme Support**: Add multiple theme support

## Troubleshooting

### Common Issues

1. **Style Conflicts**: Check CSS specificity and order
2. **Missing Styles**: Verify imports in component files
3. **Responsive Issues**: Check breakpoint usage
4. **Performance**: Monitor CSS bundle size

### Debugging

1. **Browser DevTools**: Use element inspector
2. **CSS Validation**: Validate CSS syntax
3. **Performance Tools**: Use Lighthouse for performance
4. **Cross-browser Testing**: Test on multiple browsers

## Contributing

When adding new styles:

1. **Choose the right location**: Base, component, page, phase, layout, or utility
2. **Follow naming conventions**: Use consistent naming patterns
3. **Use CSS custom properties**: Leverage the design system
4. **Test responsiveness**: Ensure mobile-first design
5. **Document complex styles**: Add comments for complex CSS
6. **Update this documentation**: Keep this guide current

## Resources

- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [BEM Methodology](https://getbem.com/)
- [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)
- [Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)

