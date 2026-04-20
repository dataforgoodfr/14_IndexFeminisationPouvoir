import Image from "next/image";
import Link from "next/link";

export default function page404() {
    return (
        <div className="flex flex-1 flex-col items-center gap-12 py-[50px]">
            <div className="flex flex-1 flex-col gap-6.5 items-center w-full max-w-[590px] h-auto">
                <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/inequal.svg`}
                    alt="Inequal image"
                    width={410}
                    height={384}
                    className="w-full max-w-[410px] h-auto"
                    priority
                />
                <div className="divider"> </div>
                <h1 className = "header-h1 text-center text-foundations-violet-principal">
                    la page demandée n'existe pas
                </h1>
                <div className="flex flex-col items-center h-full max-h-[341px]">
                    <p className="font-tstar text-foundations-violet-principal text-[214px]/[1.25] font-bold">
                        404
                    </p>
                </div>
                <Link
                href="/"
                className="button button-primary font-tstar text-[20px] font-bold uppercase;"
                >
                retour à l'accueil
                </Link>
            </div>
        </div>
    );
}