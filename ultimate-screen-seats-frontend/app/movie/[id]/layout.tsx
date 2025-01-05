import Image from 'next/image';

export default function MovieLayout({ children, backgroundImage }: { children: React.ReactNode, backgroundImage: string }) {
    return (
        <div className="absolute inset-0 w-full h-full min-h-screen">
            <div className="absolute inset-0 w-full h-full z-0">
                <Image
                    fill
                    priority
                    alt="Movie background"
                    className="object-cover blur-sm"
                    // src="https://image.tmdb.org/t/p/original/c6nouvFYnmNO50WQDLcKMI3p0jA.jpg"
                    src={backgroundImage}
                />
                <div className="absolute inset-0 bg-black bg-opacity-70" />
            </div>
            <div className="relative z-10 ">{children}</div>
        </div>
    );
}
