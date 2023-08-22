export function HeartRemove({ onClick }: { onClick: () => void }) {
  return (
    <Image
      onClick={onClick}
      src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTkuNSAxMGMtMi40ODMgMC00LjUgMi4wMTUtNC41IDQuNXMyLjAxNyA0LjUgNC41IDQuNSA0LjUtMi4wMTUgNC41LTQuNS0yLjAxNy00LjUtNC41LTQuNXptMi41IDVoLTV2LTFoNXYxem0tNi41MjcgNC41OTNjLTEuMTA4IDEuMDg2LTIuMjc1IDIuMjE5LTMuNDczIDMuNDA3LTYuNDMtNi4zODEtMTItMTEuMTQ3LTEyLTE1LjgwOCAwLTQuMDA1IDMuMDk4LTYuMTkyIDYuMjgxLTYuMTkyIDIuMTk3IDAgNC40MzQgMS4wNDIgNS43MTkgMy4yNDggMS4yNzktMi4xOTUgMy41MjEtMy4yMzggNS43MjYtMy4yMzggMy4xNzcgMCA2LjI3NCAyLjE3MSA2LjI3NCA2LjE4MiAwIC43NDYtLjE1NiAxLjQ5Ni0uNDIzIDIuMjUzLS41MjctLjQyNy0xLjEyNC0uNzY4LTEuNzY5LTEuMDE0LjEyMi0uNDI1LjE5Mi0uODM5LjE5Mi0xLjIzOSAwLTIuODczLTIuMjE2LTQuMTgyLTQuMjc0LTQuMTgyLTMuMjU3IDAtNC45NzYgMy40NzUtNS43MjYgNS4wMjEtLjc0Ny0xLjU0LTIuNDg0LTUuMDMtNS43Mi01LjAzMS0yLjMxNS0uMDAxLTQuMjggMS41MTYtNC4yOCA0LjE5MiAwIDMuNDQyIDQuNzQyIDcuODUgMTAgMTNsMi4xMDktMi4wNjRjLjM3Ni41NTcuODM5IDEuMDQ4IDEuMzY0IDEuNDY1eiIvPjwvc3ZnPg=='
    />
  );
}

export function HeartFull({ onClick }: { onClick: () => void }) {
  return (
    <Image
      onClick={onClick}
      src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgNC40MTljLTIuODI2LTUuNjk1LTExLjk5OS00LjA2NC0xMS45OTkgMy4yNyAwIDcuMjcgOS45MDMgMTAuOTM4IDExLjk5OSAxNS4zMTEgMi4wOTYtNC4zNzMgMTItOC4wNDEgMTItMTUuMzExIDAtNy4zMjctOS4xNy04Ljk3Mi0xMi0zLjI3eiIvPjwvc3ZnPg=='
    />
  );
}

export function HeartEmpty({ onClick }: { onClick: () => void }) {
  return (
    <Image
      onClick={onClick}
      src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgNC40MTljLTIuODI2LTUuNjk1LTExLjk5OS00LjA2NC0xMS45OTkgMy4yNyAwIDcuMjcgOS45MDMgMTAuOTM4IDExLjk5OSAxNS4zMTEgMi4wOTYtNC4zNzMgMTItOC4wNDEgMTItMTUuMzExIDAtNy4zMjctOS4xNy04Ljk3Mi0xMi0zLjI3eiIvPjwvc3ZnPg=='
    />
  );
}

function Image({ onClick, src }: { onClick: () => void; src: string }) {
  return (
    <img
      onClick={onClick}
      className='hover:scale-125 cursor-pointer'
      src={src}
    />
  );
}
