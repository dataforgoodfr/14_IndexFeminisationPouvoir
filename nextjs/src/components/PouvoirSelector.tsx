import Link, { type LinkProps } from "next/link";
import type { HTMLAttributes, JSX } from "react";
import { MondeIcon } from "@/components/icons/monde";
import { AutresPouvoirsIcon } from "@/components/icons/pouvoir-autres";
import { PouvoirExecutifIcon } from "@/components/icons/pouvoir-executif";
import { PouvoirLocalIcon } from "@/components/icons/pouvoir-local";
import { PouvoirParlementaireIcon } from "@/components/icons/pouvoir-parlementaire";

type PouvoirSelectorProps = LinkProps & {
	title: React.ReactNode;
	icon: (props: HTMLAttributes<HTMLOrSVGElement>) => JSX.Element;
	pouvoirKey: string;
};

const PouvoirSelector = ({
	title,
	icon: Icon,
	pouvoirKey,
	...linkProps
}: PouvoirSelectorProps) => {
	return (
		<Link
			className="flex-1 flex flex-col justify-center items-center p-2 gap-2 w-44 h-44 text-center border border-purple-oxfam-100 flex-none self-stretch bg-foundations-blanc hover:border hover:border-foundations-violet-principal hover:bg-foundations-violet-principal group bg-svg-inequal"
			data-nav-pouvoir={pouvoirKey}
			{...linkProps}
		>
			<Icon className="w-18 h-18 group-hover:fill-white" />
			<div className="nav-text text-center header-h4 group-hover:text-white whitespace-break-spaces w-full">
				{title}
			</div>
		</Link>
	);
};

export function PouvoirSelectorNav() {
	return (
		<div className="flex flex-wrap justify-center gap-4 mt-4">
			<PouvoirSelector
				title={
					<>
						Pouvoir
						<br /> exécutif
					</>
				}
				icon={PouvoirExecutifIcon}
				href="/pouvoirs/executif"
				pouvoirKey="executif"
			/>
			<PouvoirSelector
				title={
					<>
						Pouvoir
						<br /> parlementaire
					</>
				}
				icon={PouvoirParlementaireIcon}
				href="/pouvoirs/parlementaire"
				pouvoirKey="parlementaire"
			/>
			<PouvoirSelector
				title={
					<>
						Pouvoir
						<br /> local
					</>
				}
				icon={PouvoirLocalIcon}
				href="/pouvoirs/local"
				pouvoirKey="local"
			/>
			<PouvoirSelector
				title={
					<>
						Autres
						<br /> pouvoirs
					</>
				}
				icon={AutresPouvoirsIcon}
				href="/pouvoirs/autres"
				pouvoirKey="autres"
			/>
			<PouvoirSelector
				title={
					<>
						Dans le
						<br /> monde
					</>
				}
				icon={MondeIcon}
				href="/pouvoirs/monde"
				pouvoirKey="monde"
			/>
		</div>
	);
}
