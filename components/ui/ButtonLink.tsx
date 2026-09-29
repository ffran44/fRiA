type Variant = "primary" | "secondary";

const BASE =
  "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-3 text-lg font-semibold no-underline transition-[background-color,color,box-shadow,scale] duration-200 active:scale-[0.97]";

const VARIANTS: Record<Variant, string> = {
  // blanco sobre celeste-profundo: 4.51:1. Hover a noche (14.8:1).
  primary: "bg-celeste-profundo text-blanco hover:bg-noche",
  secondary: "text-noche shadow-[inset_0_0_0_2px_var(--color-noche)] hover:bg-noche hover:text-blanco",
};

type ButtonLinkProps = React.ComponentProps<"a"> & { variant?: Variant };

export default function ButtonLink({ variant = "primary", className, ...props }: ButtonLinkProps) {
  return <a className={`${BASE} ${VARIANTS[variant]} ${className ?? ""}`} {...props} />;
}
