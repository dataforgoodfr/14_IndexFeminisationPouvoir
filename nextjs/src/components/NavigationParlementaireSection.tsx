import { NavigationParlementaire } from "./NavigationParlementaire";

type NavItem = {
	label: string;
	href: string;
	icon: React.ReactNode;
	parlementKey: string;
};

type Props = {
	navItems: NavItem[];
	children: React.ReactNode;
};

export const NavigationParlementaireSection = ({
	navItems,
	children,
}: Props) => {
	return (
		<>
			{/* Purple banner - always shown. Desktop: navs are absolutely positioned inside. */}
			<div className="w-full lg:relative flex flex-col items-center justify-start lg:mb-38">
				<div className="w-full bg-foundations-violet-principal h-28 flex items-center lg:items-start lg:py-6 justify-center">
					<div className="body4-medium text-foundations-blanc">
						Les chiffres en détails
					</div>
				</div>
				<div className="hidden lg:flex lg:absolute top-20 flex-row w-auto gap-4">
					{navItems.map((item) => (
						<NavigationParlementaire
							key={item.href}
							label={item.label}
							href={item.href}
							icon={item.icon}
							parlementKey={item.parlementKey}
						/>
					))}
				</div>
			</div>

			{/* Mobile: all items rendered here, CSS shows only the active one above children */}
			<div className="parlement-active-section lg:hidden flex flex-col w-full">
				{navItems.map((item) => (
					<NavigationParlementaire
						key={item.href}
						label={item.label}
						href={item.href}
						icon={item.icon}
						parlementKey={item.parlementKey}
					/>
				))}
			</div>

			{children}

			{/* Mobile: all items rendered here, CSS hides the active one leaving only inactive items */}
			<div className="parlement-inactive-section lg:hidden flex flex-col gap-4 w-full">
				{navItems.map((item) => (
					<NavigationParlementaire
						key={item.href}
						label={item.label}
						href={item.href}
						icon={item.icon}
						parlementKey={item.parlementKey}
					/>
				))}
			</div>
		</>
	);
};
