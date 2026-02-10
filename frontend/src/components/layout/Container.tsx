import { ReactNode } from "react";

type ContainerProps = {
    children: ReactNode;
    className?: string;
};

export default function Container({ children, className = "" }: ContainerProps) {
    return (
        <div className={`mx-auto max-w-[1600px] px-4 md:px-8 ${className}`}>
            {children}
        </div>
    );
}
