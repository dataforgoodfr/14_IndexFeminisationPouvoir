import { PouvoirSelectorNav } from "@/components/PouvoirSelector";

export default function PouvoirLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="pouvoirs-wrapper">
			<div className="flex flex-1 justify-center px-4 bg-purple-oxfam-100 ">
				<div className="flex flex-col gap-4 max-w-296 items-center  py-12 md:items-start ">
					<PouvoirSelectorNav />
				</div>
			</div>
			<div className="flex flex-col mt-20 gap-8  items-center justify-center ">
				{children}
			</div>
		</div>
	);
}
