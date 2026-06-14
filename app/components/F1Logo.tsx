import Image from "next/image";
import f1Logo from "@/app/assets/f1-logo.svg";

interface F1LogoProps {
  className?: string;
  priority?: boolean;
}

export const F1Logo = ({
  className = "h-8 sm:h-10 w-auto object-contain logo-glow",
  priority = false,
}: F1LogoProps) => (
  <Image
    src={f1Logo}
    alt="Formula 1 logo"
    width={200}
    height={96}
    className={className}
    priority={priority}
  />
);
