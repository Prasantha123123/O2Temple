import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-gradient-to-br from-teal-500 to-blue-600">
                <span className="text-white font-bold text-sm">O<sub className="text-xs">2</sub></span>
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    O2 Temple
                </span>
            </div>
        </>
    );
}
