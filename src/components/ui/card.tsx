import { cn } from "@/src/lib/utils";

interface CardProps {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  id?: string;
}

export function Card({ className, children, onClick, style, id }: CardProps) {
  return (
    <div className={cn("card", className)} onClick={onClick} style={style} id={id}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: CardProps) {
  return (
    <div className={cn("card-header", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children }: CardProps) {
  return (
    <h3 className={cn("card-title", className)}>{children}</h3>
  );
}

export function CardDescription({ className, children }: CardProps) {
  return (
    <p className={cn("card-description", className)}>{children}</p>
  );
}

export function CardContent({ className, children }: CardProps) {
  return <div className={cn("", className)}>{children}</div>;
}

export function CardFooter({ className, children }: CardProps) {
  return <div className={cn("border-t border-border px-6 py-4", className)}>{children}</div>;
}
