import type { LinkProps } from "next/link";
import Link from "next/link";

type NavigationParlementaireProps = {
	label: string;
	href: LinkProps["href"];
	icon: React.ReactNode;
	parlementKey: string;
};

export const NavigationParlementaire = ({
	label,
	href,
	icon,
	parlementKey,
}: NavigationParlementaireProps) => {
	return (
		<Link href={href} data-nav-parlement={parlementKey}>
			<div className="nav-parlement-card flex flex-row lg:flex-col justify-between lg:justify-center items-center px-6 py-2 gap-3 rounded min-h-20 w-full lg:w-44 relative border-foundations-violet-principal bg-foundations-violet-tres-clair border-l-4 lg:border-l-0">
				<h4 className="header-h4 text-center">{label}</h4>

				{/* Desktop icon: hidden by default, shown when active via CSS */}
				<div className="nav-icon-desktop hidden">{icon}</div>
				{/* Mobile icon: always shown */}
				<div className="lg:hidden">{icon}</div>

				{/* Bottom arrow: shown when active via CSS */}
				<div className="nav-arrow-bottom hidden absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-10 border-r-10 border-t-10 border-l-transparent border-r-transparent border-t-foundations-violet-principal" />
				{/* Left arrow: shown on mobile for inactive items, hidden when active via CSS */}
				<div className="nav-arrow-left lg:hidden absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-10 border-b-10 border-l-10 border-t-transparent border-b-transparent border-l-foundations-violet-principal" />
			</div>
		</Link>
	);
};
