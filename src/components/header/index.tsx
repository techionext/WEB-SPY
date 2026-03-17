export const Header = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="flex flex-col gap-0">
      <p className="text-2xl text-default-500 font-bold">{title}</p>
      <p className="text-sm  text-default-500">{description}</p>
    </div>
  );
};
