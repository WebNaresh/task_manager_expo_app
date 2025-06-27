├── .cursor
│   └── rules
│       ├── coding-conventions.mdc
│       └── glory-prime-app-structure.mdc
├── .gitignore
├── app
│   ├── (admin)
│   │   ├── dashboard
│   │   │   ├── client
│   │   │   │   └── index.tsx
│   │   │   ├── index.tsx
│   │   │   ├── manager
│   │   │   │   └── index.tsx
│   │   │   ├── tasklist
│   │   │   │   ├── index.tsx
│   │   │   │   └── [task_list_id]
│   │   │   │       └── index.tsx
│   │   │   ├── [priority_id]
│   │   │   │   └── index.tsx
│   │   │   └── _layout.tsx
│   │   ├── profile
│   │   │   └── index.tsx
│   │   ├── tasks
│   │   │   ├── add_task
│   │   │   │   └── index.tsx
│   │   │   ├── index.tsx
│   │   │   ├── [task_id]
│   │   │   │   ├── delete
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── edit
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   └── [user_id]
│   │   │   │       ├── remark_modal.tsx
│   │   │   │       └── [task_list_id]
│   │   │   │           └── status_modal.tsx
│   │   │   └── _layout.tsx
│   │   └── _layout.tsx
│   ├── (manager)
│   │   ├── dashboard
│   │   │   └── index.tsx
│   │   ├── profile
│   │   │   └── index.tsx
│   │   ├── tasks
│   │   │   ├── index.tsx
│   │   │   ├── [task_id]
│   │   │   │   ├── delete
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── edit
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   └── [user_id]
│   │   │   │       ├── remark_modal.tsx
│   │   │   │       └── [task_list_id]
│   │   │   │           └── status_modal.tsx
│   │   │   └── _layout.tsx
│   │   └── _layout.tsx
│   ├── +html.tsx
│   ├── +not-found.tsx
│   ├── add_client_modal.tsx
│   ├── add_rm_modal.tsx
│   ├── add_tasklist_modal.tsx
│   ├── index.tsx
│   ├── login.tsx
│   ├── modal.tsx
│   └── _layout.tsx
├── app.json
├── assets
│   ├── fonts
│   │   └── SpaceMono-Regular.ttf
│   └── images
│       ├── adaptive-icon.png
│       ├── favicon.png
│       ├── icon.png
│       └── splash-icon.png
├── components
│   ├── input
│   │   ├── text-input.tsx
│   │   └── _components
│   │       ├── color-input.tsx
│   │       ├── date-input.tsx
│   │       ├── password-input.tsx
│   │       ├── select-input.tsx
│   │       └── text-area-input.tsx
│   ├── notification-wrapper.tsx
│   ├── task
│   │   ├── add_task
│   │   │   ├── comp.tsx
│   │   │   └── task-skeleton.tsx
│   │   ├── edit_task
│   │   │   └── comp.tsx
│   │   └── task_list.tsx
│   ├── Themed.tsx
│   ├── ui
│   │   ├── button.tsx
│   │   ├── modal.tsx
│   │   ├── rm
│   │   │   └── header.tsx
│   │   └── toast.tsx
│   └── useColorScheme.ts
├── constants
│   ├── Colors.ts
│   ├── config.ts
│   └── response.json
├── eas.json
├── expo-env.d.ts
├── hooks
│   └── useAuth.ts
├── package.json
├── task-table.tsx
├── Tree.md
├── tsconfig.json
└── yarn.lock
