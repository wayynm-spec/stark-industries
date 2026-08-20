export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stark-50 to-surface-50">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
