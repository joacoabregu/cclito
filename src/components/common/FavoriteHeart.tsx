const removeText = 'Quitar de favoritos'

export function HeartRemove({ onClick }: { onClick: () => void }) {
  return (
    <div className="tooltip tooltip-bottom" data-tip={removeText}>
    <Image
      onClick={onClick}
      src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTkuNSAxMGMtMi40ODMgMC00LjUgMi4wMTUtNC41IDQuNXMyLjAxNyA0LjUgNC41IDQuNSA0LjUtMi4wMTUgNC41LTQuNS0yLjAxNy00LjUtNC41LTQuNXptMi41IDVoLTV2LTFoNXYxem0tNi41MjcgNC41OTNjLTEuMTA4IDEuMDg2LTIuMjc1IDIuMjE5LTMuNDczIDMuNDA3LTYuNDMtNi4zODEtMTItMTEuMTQ3LTEyLTE1LjgwOCAwLTQuMDA1IDMuMDk4LTYuMTkyIDYuMjgxLTYuMTkyIDIuMTk3IDAgNC40MzQgMS4wNDIgNS43MTkgMy4yNDggMS4yNzktMi4xOTUgMy41MjEtMy4yMzggNS43MjYtMy4yMzggMy4xNzcgMCA2LjI3NCAyLjE3MSA2LjI3NCA2LjE4MiAwIC43NDYtLjE1NiAxLjQ5Ni0uNDIzIDIuMjUzLS41MjctLjQyNy0xLjEyNC0uNzY4LTEuNzY5LTEuMDE0LjEyMi0uNDI1LjE5Mi0uODM5LjE5Mi0xLjIzOSAwLTIuODczLTIuMjE2LTQuMTgyLTQuMjc0LTQuMTgyLTMuMjU3IDAtNC45NzYgMy40NzUtNS43MjYgNS4wMjEtLjc0Ny0xLjU0LTIuNDg0LTUuMDMtNS43Mi01LjAzMS0yLjMxNS0uMDAxLTQuMjggMS41MTYtNC4yOCA0LjE5MiAwIDMuNDQyIDQuNzQyIDcuODUgMTAgMTNsMi4xMDktMi4wNjRjLjM3Ni41NTcuODM5IDEuMDQ4IDEuMzY0IDEuNDY1eiIvPjwvc3ZnPg=='
    />
    </div>
  );
}

export function HeartFull({ onClick }: { onClick: () => void }) {
  return (
    <div className="tooltip" data-tip={removeText}>
      <Image
        onClick={onClick}
        src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgNC40MTljLTIuODI2LTUuNjk1LTExLjk5OS00LjA2NC0xMS45OTkgMy4yNyAwIDcuMjcgOS45MDMgMTAuOTM4IDExLjk5OSAxNS4zMTEgMi4wOTYtNC4zNzMgMTItOC4wNDEgMTItMTUuMzExIDAtNy4zMjctOS4xNy04Ljk3Mi0xMi0zLjI3eiIvPjwvc3ZnPg=='
      />
    </div>
  );
}

export function HeartEmpty({ onClick }: { onClick: () => void }) {
  return (
    <div className="tooltip tooltip-bottom" data-tip="Añadir a favoritos">
      <Image
        onClick={onClick}
        src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMiAyMS41OTNjLTUuNjMtNS41MzktMTEtMTAuMjk3LTExLTE0LjQwMiAwLTMuNzkxIDMuMDY4LTUuMTkxIDUuMjgxLTUuMTkxIDEuMzEyIDAgNC4xNTEuNTAxIDUuNzE5IDQuNDU3IDEuNTktMy45NjggNC40NjQtNC40NDcgNS43MjYtNC40NDcgMi41NCAwIDUuMjc0IDEuNjIxIDUuMjc0IDUuMTgxIDAgNC4wNjktNS4xMzYgOC42MjUtMTEgMTQuNDAybTUuNzI2LTIwLjU4M2MtMi4yMDMgMC00LjQ0NiAxLjA0Mi01LjcyNiAzLjIzOC0xLjI4NS0yLjIwNi0zLjUyMi0zLjI0OC01LjcxOS0zLjI0OC0zLjE4MyAwLTYuMjgxIDIuMTg3LTYuMjgxIDYuMTkxIDAgNC42NjEgNS41NzEgOS40MjkgMTIgMTUuODA5IDYuNDMtNi4zOCAxMi0xMS4xNDggMTItMTUuODA5IDAtNC4wMTEtMy4wOTUtNi4xODEtNi4yNzQtNi4xODEiLz48L3N2Zz4='
      />
    </div>
  );
}

export function EditIcon({ onClick }: { onClick: () => void }) {
  return (
    <Image
      onClick={onClick}
      src='data:image/svg+xml;base64,PHN2ZyBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtOS4xMzQgMTkuMzE5IDExLjU4Ny0xMS41ODhjLjE3MS0uMTcxLjI3OS0uNDIzLjI3OS0uNjg0IDAtLjIyOS0uMDgzLS40NjYtLjI4LS42NjJsLTMuMTE1LTMuMTA0Yy0uMTg1LS4xODUtLjQyOS0uMjc3LS42NzItLjI3N3MtLjQ4Ni4wOTItLjY3Mi4yNzdsLTExLjYwNiAxMS41NjZjLS41NjkgMS43NjMtMS41NTUgNC44MjMtMS42MjYgNS4wODEtLjAyLjA3NS0uMDI5LjE1LS4wMjkuMjI0IDAgLjQ2MS4zNDkuODQ4Ljc2NS44NDguNTExIDAgLjk5MS0uMTg5IDUuMzY5LTEuNjgxem0tMy4yNy0zLjM0MiAyLjEzNyAyLjEzNy0zLjE2OCAxLjA0NnptLjk1NS0xLjE2NiAxMC4xMTQtMTAuMDc5IDIuMzM1IDIuMzI3LTEwLjA5OSAxMC4xMDF6IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48L3N2Zz4='
      css='w-8'
    />
  );
}

function Image({ onClick, src, css = '' }: { onClick: () => void; src: string, css?: string }) {
  return (
    <img
      onClick={onClick}
      className={`hover:scale-125 cursor-pointer ${css}`}
      src={src}
    />
  );
}
