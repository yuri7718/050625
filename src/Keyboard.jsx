import { clsx } from 'clsx';
import { BackspaceIcon } from './assets/Backspace';
import { keys } from './constants/keys';


export const Keyboard = ({onKeyPress}) => {
  
  const Key = ({children, className, value}) => {
    return (
      <div
        className={clsx(
          "flex items-center justify-center rounded-md bg-gray-300 p-4 hover:cursor-pointer hover:bg-gray-400",
          className
        )}
        onClick={() => onKeyPress(value)}
      >
        {children}
      </div>
    )
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {keys.map((row, i) => (
          <div key={i} className="flex gap-4 justify-center">
            {row.map((letter, j) => {
              switch (letter) {
                case 'ENTER':
                  return <Key key={j} className="w-fit h-12 hover:text-white" value={letter}>Enter</Key>;
                case 'BACKSPACE':
                  return <Key key={j} className="w-fit h-12 fill-black hover:fill-white" value={letter}><BackspaceIcon /></Key>;
                default:
                  return <Key key={j} className="w-12 h-12 hover:text-white" value={letter}>{letter}</Key>;
              }
            })}
          </div>
        ))}
      </div>
    </>
  );
}