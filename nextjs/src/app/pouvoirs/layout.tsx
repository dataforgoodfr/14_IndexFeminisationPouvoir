export default function PouvoirLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="flex flex-col mt-20 gap-8  items-center justify-center ">
        {children}
      </div>
    </div>
  );
}
