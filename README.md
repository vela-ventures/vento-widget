# Vento Swap Widget

React widget for token swapping on AO (Vento SDK). Draggable button, modal, token selector, quotes, execution, and live status. Light/dark themes.

## Features

- Floating button (optional drag)
- Quotes + execution (`@vela-ventures/vento-sdk`)
- Wallet-aware overlay when not connected

## Install

```bash
npm install @vento/widget
```

React 18+ is required.

## Quick start

```tsx
import { VentoWidget } from "@vento/widget";

export default function App() {
  return <VentoWidget />;
}
```

The widget uses `window.arweaveWallet.getActiveAddress()`. If unavailable, it shows a "Wallet is not connected" overlay.

### Passing a signer (optional)

If you want to provide a signer explicitly (e.g., injected or custom wallet), pass it to the widget. The widget will wrap it with `createDataItemSigner` internally.

```tsx
<VentoWidget signer={window.arweaveWallet} />
```

## Props (most-used)

```ts
type ModalPosition = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
};

interface VentoWidgetProps {
  theme?: "light" | "dark"; // default: "dark"
  position?: ModalPosition; // button position
  draggable?: boolean; // default: true
  signer?: any; // optional
  // More: buttonClassName, modalClassName, showBackdrop, buttonContent, onButtonClick, onModalClose
}
```

## Theming

CSS variables are scoped to `.vento-widget`. You can override them in host apps:

```css
.vento-widget {
  /* host overrides */
}
```

## Development

```bash
npm run dev       # watch build
npm run build     # production build
npm run type-check
```

## Notes

- Externalized deps: `@vela-ventures/vento-sdk`, `@permaweb/aoconnect` (install in host app).
- Wallet detection uses `getActiveAddress()` with overlay fallback.

## License

MIT
