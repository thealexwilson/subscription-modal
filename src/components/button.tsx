import clsx from "clsx";

const Button = ({ children, variant = 'primary', ...props }) => (
    <button
        className={clsx(
        'px-4 py-2 rounded font-medium transition',
        variant === 'primary' && 'bg-blue-500 hover:bg-blue-600 text-white',
        variant === 'secondary' && 'bg-gray-200 hover:bg-gray-300'
        )}
        {...props}
    >
        {children}
    </button>
);

export default Button