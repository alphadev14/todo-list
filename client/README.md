# Todo List Client - ReactJS

## Cấu trúc thư mục chuẩn (tham khảo các công ty lớn)

```
src/
├── assets/        # Hình ảnh, icon, font, style
├── components/    # Các component dùng lại
├── constants/     # Các hằng số dùng chung
├── hooks/         # Custom hooks
├── layouts/       # Layout cho các trang
├── pages/         # Các trang chính (Login, Register, TodoList, Admin...)
├── routes/        # Quản lý cấu hình router
├── services/      # Gọi API, xử lý dữ liệu từ backend
├── store/         # Quản lý state (Redux, Context...)
├── utils/         # Hàm tiện ích
├── App.js         # File root của ứng dụng
├── App.css        # CSS tổng cho app
└── index.js       # Entry point
```

### Ghi chú:

- Tách biệt rõ các phần để dễ mở rộng, bảo trì.
- `components` chỉ chứa các thành phần nhỏ, dùng lại nhiều nơi.
- `pages` chứa các màn hình chính, mỗi màn hình có thể dùng nhiều component.
- `services` để gọi API, xử lý logic giao tiếp với backend.
- `store` dùng cho quản lý state toàn cục (Redux, Context API).
- `assets` chứa hình ảnh, icon, font, style chung.
- `layouts` cho các layout (ví dụ: layout cho trang admin, layout cho trang người dùng).
- `routes` cấu hình các route, phân quyền truy cập.
- `utils` chứa các hàm tiện ích dùng chung.
- `constants` chứa các hằng số, biến môi trường, config.

Bạn nên tuân thủ cấu trúc này để dự án dễ phát triển, teamwork hiệu quả và chuẩn hóa theo các công ty lớn.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
