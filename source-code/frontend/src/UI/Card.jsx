import { cn } from "../utils/functions";

export default function Card({
  children,
  title,
  extra,
  className,
  headClass,
  bodyClass,
}) {
  return (
    <div
      className={cn(
        "cardContainer border rounded-lg bg-cardBg dark:bg-[#1C1B20]",
        {
          [className]: className,
        }
      )}
    >
      {(title || extra) && (
        <div
          className={cn("cartHeadContainer flex justify-between p-2 border-b", {
            [headClass]: headClass,
          })}
        >
          <h1 className='cartTitle text-base md:text-lg font-medium px-2 text-black/80'>
            {title}
          </h1>
          <div className='cartExtra flex gap-2 items-center'>{extra}</div>
        </div>
      )}
      <div className={cn("p-2", { [bodyClass]: bodyClass })}> {children}</div>
    </div>
  );
}
